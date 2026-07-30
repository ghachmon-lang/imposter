(() => {
  "use strict";

  const STORAGE_KEY = "imposter.settings.v1";

  const settings = {
    playerCount: 4,
    names: [],
    imposterCount: 1,
    category: "random",
    difficulty: "mixed",
    showHint: true,
    timerSeconds: 120,
  };

  const round = {
    categoryKey: null,
    word: null,
    imposters: [],   // player indices
    revealIndex: 0,
    roleShown: false,
    starter: 0,
    clockwise: true,
  };

  const scores = { crew: 0, imposters: 0 };
  const usedWords = new Set();

  let timerId = null;
  let timerRemaining = 0;

  const $ = (id) => document.getElementById(id);

  // ---------- helpers ----------

  function maxImposters(players) {
    if (players >= 9) return 3;
    if (players >= 6) return 2;
    return 1;
  }

  function playerName(i) {
    const raw = (settings.names[i] || "").trim();
    return raw || `Player ${i + 1}`;
  }

  function randomInt(n) {
    return Math.floor(Math.random() * n);
  }

  function sample(arr) {
    return arr[randomInt(arr.length)];
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) { /* private mode etc. — settings just won't persist */ }
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (typeof saved.playerCount === "number") settings.playerCount = Math.min(12, Math.max(3, saved.playerCount));
      if (Array.isArray(saved.names)) settings.names = saved.names.map(String);
      if (typeof saved.imposterCount === "number") settings.imposterCount = saved.imposterCount;
      if (typeof saved.category === "string" && (saved.category === "random" || WORDS[saved.category])) settings.category = saved.category;
      if (["easy", "medium", "hard", "mixed"].includes(saved.difficulty)) settings.difficulty = saved.difficulty;
      if (typeof saved.showHint === "boolean") settings.showHint = saved.showHint;
      if (typeof saved.timerSeconds === "number") settings.timerSeconds = saved.timerSeconds;
      settings.imposterCount = Math.min(settings.imposterCount, maxImposters(settings.playerCount));
      settings.imposterCount = Math.max(1, settings.imposterCount);
    } catch (e) { /* corrupt storage — fall back to defaults */ }
  }

  // ---------- navigation ----------

  function show(screenId) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $(screenId).classList.add("active");
    window.scrollTo(0, 0);
  }

  // ---------- setup screen ----------

  function renderSetup() {
    $("players-count").textContent = settings.playerCount;
    $("players-minus").disabled = settings.playerCount <= 3;
    $("players-plus").disabled = settings.playerCount >= 12;

    const cap = maxImposters(settings.playerCount);
    settings.imposterCount = Math.min(settings.imposterCount, cap);
    $("imposters-count").textContent = settings.imposterCount;
    $("imposters-minus").disabled = settings.imposterCount <= 1;
    $("imposters-plus").disabled = settings.imposterCount >= cap;
    $("imposters-hint").textContent =
      cap === 1
        ? "Up to 1 imposter with fewer than 6 players."
        : `Up to ${cap} imposters with ${settings.playerCount} players.`;

    const namesWrap = $("player-names");
    namesWrap.innerHTML = "";
    for (let i = 0; i < settings.playerCount; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 14;
      input.placeholder = `Player ${i + 1}`;
      input.value = settings.names[i] || "";
      input.autocomplete = "off";
      input.addEventListener("input", () => {
        settings.names[i] = input.value;
        saveSettings();
      });
      namesWrap.appendChild(input);
    }

    document.querySelectorAll("#category-chips .chip").forEach((chip) => {
      chip.classList.toggle("chip-selected", chip.dataset.category === settings.category);
    });
    document.querySelectorAll("#difficulty-chips .chip").forEach((chip) => {
      chip.classList.toggle("chip-selected", chip.dataset.difficulty === settings.difficulty);
    });
    document.querySelectorAll("#timer-chips .chip").forEach((chip) => {
      chip.classList.toggle("chip-selected", Number(chip.dataset.timer) === settings.timerSeconds);
    });
    $("hint-toggle").checked = settings.showHint;
  }

  function buildCategoryChips() {
    const wrap = $("category-chips");
    const randomChip = document.createElement("button");
    randomChip.className = "chip";
    randomChip.dataset.category = "random";
    randomChip.textContent = "🎲 Random";
    wrap.appendChild(randomChip);
    for (const [key, cat] of Object.entries(WORDS)) {
      const chip = document.createElement("button");
      chip.className = "chip";
      chip.dataset.category = key;
      chip.textContent = `${cat.emoji} ${cat.label}`;
      wrap.appendChild(chip);
    }
    wrap.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      settings.category = chip.dataset.category;
      saveSettings();
      renderSetup();
    });
  }

  // ---------- round lifecycle ----------

  function wordPool(categoryKey) {
    const cat = WORDS[categoryKey];
    if (settings.difficulty === "mixed") {
      return [...cat.easy, ...cat.medium, ...cat.hard];
    }
    return cat[settings.difficulty];
  }

  function pickWord() {
    const categoryKey =
      settings.category === "random" ? sample(Object.keys(WORDS)) : settings.category;
    const pool = wordPool(categoryKey);
    let fresh = pool.filter((w) => !usedWords.has(w));
    if (fresh.length === 0) {
      // Pool exhausted this session — allow repeats again.
      pool.forEach((w) => usedWords.delete(w));
      fresh = pool;
    }
    const word = sample(fresh);
    usedWords.add(word);
    round.categoryKey = categoryKey;
    round.word = word;
  }

  function assignRoles() {
    const indices = [...Array(settings.playerCount).keys()];
    // Fisher–Yates, take the first N as imposters.
    for (let i = indices.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    round.imposters = indices.slice(0, settings.imposterCount);
  }

  function startRound() {
    pickWord();
    assignRoles();
    round.revealIndex = 0;
    round.roleShown = false;
    round.starter = randomInt(settings.playerCount);
    round.clockwise = Math.random() < 0.5;
    renderReveal();
    show("screen-reveal");
  }

  // ---------- reveal ----------

  function renderReveal() {
    $("reveal-progress").textContent = `Player ${round.revealIndex + 1} of ${settings.playerCount}`;
    $("reveal-pass-name").textContent = playerName(round.revealIndex);
    $("reveal-pass").classList.toggle("hidden", round.roleShown);
    $("reveal-role").classList.toggle("hidden", !round.roleShown);

    if (!round.roleShown) return;

    const isImposter = round.imposters.includes(round.revealIndex);
    const card = $("role-card");
    card.classList.toggle("imposter", isImposter);
    card.classList.toggle("crew", !isImposter);

    const cat = WORDS[round.categoryKey];
    if (isImposter) {
      $("role-emoji").textContent = "🎭";
      $("role-heading").textContent = "You are";
      $("role-word").textContent = "The Imposter";
      $("role-note").textContent = settings.showHint
        ? `Category: ${cat.emoji} ${cat.label}. You don't know the word — blend in.`
        : "You don't know the word. Listen closely and blend in.";
    } else {
      $("role-emoji").textContent = cat.emoji;
      $("role-heading").textContent = "The secret word is";
      $("role-word").textContent = round.word;
      $("role-note").textContent = "Give clues that prove you know it — without giving it away.";
    }
  }

  function nextReveal() {
    round.roleShown = false;
    round.revealIndex += 1;
    if (round.revealIndex >= settings.playerCount) {
      startDiscussion();
    } else {
      renderReveal();
    }
  }

  // ---------- discussion & timer ----------

  function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function updateTimerDisplay() {
    const display = $("timer-display");
    display.textContent = timerRemaining > 0 ? formatTime(timerRemaining) : "Time's up!";
    display.classList.toggle("timer-low", timerRemaining > 0 && timerRemaining <= 10);
  }

  function toggleTimer() {
    if (timerRemaining <= 0) return;
    if (timerId !== null) {
      stopTimer();
      $("btn-timer-toggle").textContent = "Resume Timer";
      return;
    }
    $("btn-timer-toggle").textContent = "Pause Timer";
    timerId = setInterval(() => {
      timerRemaining -= 1;
      updateTimerDisplay();
      if (timerRemaining <= 0) {
        stopTimer();
        $("btn-timer-toggle").textContent = "Time's Up";
      }
    }, 1000);
  }

  function startDiscussion() {
    $("starter-name").textContent = playerName(round.starter);
    $("starter-direction").textContent = round.clockwise
      ? "then continue clockwise ↻"
      : "then continue counter-clockwise ↺";

    stopTimer();
    timerRemaining = settings.timerSeconds;
    const hasTimer = settings.timerSeconds > 0;
    $("timer-block").classList.toggle("hidden", !hasTimer);
    if (hasTimer) {
      $("btn-timer-toggle").textContent = "Start Timer";
      updateTimerDisplay();
    }
    show("screen-discussion");
  }

  // ---------- vote & result ----------

  function renderVote() {
    const grid = $("vote-grid");
    grid.innerHTML = "";
    for (let i = 0; i < settings.playerCount; i++) {
      const btn = document.createElement("button");
      btn.className = "vote-btn";
      btn.textContent = playerName(i);
      btn.addEventListener("click", () => finishRound(i));
      grid.appendChild(btn);
    }
  }

  function imposterNames() {
    return round.imposters.map(playerName);
  }

  function finishRound(accusedIndex) {
    stopTimer();
    const cat = WORDS[round.categoryKey];
    const names = imposterNames();
    const namesText = names.join(" & ");
    const plural = names.length > 1;

    const emoji = $("result-emoji");
    const title = $("result-title");
    const sub = $("result-sub");
    const steal = $("steal-note");
    title.classList.remove("win", "lose");

    if (accusedIndex === null) {
      emoji.textContent = "🃏";
      title.textContent = "The Reveal";
      sub.textContent = "No official vote this round.";
      steal.classList.add("hidden");
    } else if (round.imposters.includes(accusedIndex)) {
      scores.crew += 1;
      emoji.textContent = "🎉";
      title.textContent = "Imposter Caught!";
      title.classList.add("win");
      sub.textContent = `${playerName(accusedIndex)} was ${plural ? "an" : "the"} imposter.`;
      steal.classList.remove("hidden");
      steal.textContent = `🎭 Last chance: if ${playerName(accusedIndex)} can guess the secret word out loud right now, the imposter${plural ? "s" : ""} steal${plural ? "" : "s"} the win!`;
    } else {
      scores.imposters += 1;
      emoji.textContent = "😈";
      title.textContent = plural ? "The Imposters Win!" : "The Imposter Wins!";
      title.classList.add("lose");
      sub.textContent = `${playerName(accusedIndex)} was innocent.`;
      steal.classList.add("hidden");
    }

    $("result-word").textContent = round.word;
    $("result-imposters").innerHTML =
      `${cat.emoji} ${cat.label} · ${plural ? "Imposters" : "Imposter"}: <strong>${namesText}</strong>`;
    $("scoreboard").textContent =
      `Score — Crew ${scores.crew} · Imposters ${scores.imposters}`;

    show("screen-result");
  }

  // ---------- wiring ----------

  function bind() {
    $("btn-new-game").addEventListener("click", () => {
      renderSetup();
      show("screen-setup");
    });
    $("btn-how-to").addEventListener("click", () => show("screen-help"));

    document.querySelectorAll("[data-back]").forEach((btn) => {
      btn.addEventListener("click", () => show(btn.dataset.back));
    });

    $("players-minus").addEventListener("click", () => {
      settings.playerCount = Math.max(3, settings.playerCount - 1);
      saveSettings();
      renderSetup();
    });
    $("players-plus").addEventListener("click", () => {
      settings.playerCount = Math.min(12, settings.playerCount + 1);
      saveSettings();
      renderSetup();
    });
    $("imposters-minus").addEventListener("click", () => {
      settings.imposterCount = Math.max(1, settings.imposterCount - 1);
      saveSettings();
      renderSetup();
    });
    $("imposters-plus").addEventListener("click", () => {
      settings.imposterCount = Math.min(maxImposters(settings.playerCount), settings.imposterCount + 1);
      saveSettings();
      renderSetup();
    });

    $("difficulty-chips").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      settings.difficulty = chip.dataset.difficulty;
      saveSettings();
      renderSetup();
    });
    $("timer-chips").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      settings.timerSeconds = Number(chip.dataset.timer);
      saveSettings();
      renderSetup();
    });
    $("hint-toggle").addEventListener("change", (e) => {
      settings.showHint = e.target.checked;
      saveSettings();
    });

    $("btn-start").addEventListener("click", startRound);

    $("btn-show-role").addEventListener("click", () => {
      round.roleShown = true;
      renderReveal();
    });
    $("btn-hide-role").addEventListener("click", nextReveal);

    $("btn-timer-toggle").addEventListener("click", toggleTimer);
    $("btn-to-vote").addEventListener("click", () => {
      stopTimer();
      renderVote();
      show("screen-vote");
    });
    $("btn-no-vote").addEventListener("click", () => finishRound(null));

    $("btn-play-again").addEventListener("click", startRound);
    $("btn-change-setup").addEventListener("click", () => {
      renderSetup();
      show("screen-setup");
    });
  }

  loadSettings();
  buildCategoryChips();
  renderSetup();
  bind();
})();
