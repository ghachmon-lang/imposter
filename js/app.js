(() => {
  "use strict";

  const STORAGE_KEY = "imposter.settings.v2";
  const LEGACY_KEY = "imposter.settings.v1";
  const ALL_KEYS = Object.keys(WORDS);

  const settings = {
    playerCount: 4,
    names: [],
    imposterCount: 1,
    mode: "word",
    categories: [...ALL_KEYS],
    difficulty: "mixed",
    showHint: true,
    imposterCanStart: true,
    timerSeconds: 120,
  };

  const round = {
    active: false,
    mode: "word",
    categoryKey: null,
    word: null,          // word mode: the secret word
    question: null,      // question mode: the group's question
    imposterQuestion: null,
    imposters: [],       // player indices
    viewed: [],          // booleans per player
    current: -1,         // player index on the reveal screen
    revealed: false,
    starter: 0,
    clockwise: true,
  };

  const scores = { crew: 0, imposters: 0 };
  const usedWords = new Set();
  const usedQuestions = new Set();

  let timerId = null;
  let timerRemaining = 0;
  let accused = -1;
  let endArmTimeout = null;
  let wakeLock = null;

  const $ = (id) => document.getElementById(id);

  // ---------- helpers ----------

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function maxImposters(players) {
    if (players >= 9) return 3;
    if (players >= 6) return 2;
    return 1;
  }

  function playerName(i) {
    const raw = (settings.names[i] || "").trim();
    return raw || `Player ${i + 1}`;
  }

  function initial(i) {
    // [...str] keeps surrogate pairs (emoji) intact, unlike charAt.
    const first = [...playerName(i)][0] || "?";
    return first.toUpperCase();
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
      let raw = localStorage.getItem(STORAGE_KEY);
      let saved = raw ? JSON.parse(raw) : null;
      if (!saved) {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
          saved = JSON.parse(legacy);
          saved.categories =
            saved.category && WORDS[saved.category] ? [saved.category] : [...ALL_KEYS];
        }
      }
      if (!saved) return;
      if (typeof saved.playerCount === "number") settings.playerCount = Math.min(12, Math.max(3, saved.playerCount));
      if (Array.isArray(saved.names)) settings.names = saved.names.map(String);
      if (typeof saved.imposterCount === "number") settings.imposterCount = saved.imposterCount;
      if (saved.mode === "word" || saved.mode === "question") settings.mode = saved.mode;
      if (Array.isArray(saved.categories)) {
        settings.categories = saved.categories.filter((k) => WORDS[k]);
      }
      if (["easy", "medium", "hard", "mixed"].includes(saved.difficulty)) settings.difficulty = saved.difficulty;
      if (typeof saved.showHint === "boolean") settings.showHint = saved.showHint;
      if (typeof saved.imposterCanStart === "boolean") settings.imposterCanStart = saved.imposterCanStart;
      if (typeof saved.timerSeconds === "number") settings.timerSeconds = saved.timerSeconds;
      settings.imposterCount = Math.max(1, Math.min(settings.imposterCount, maxImposters(settings.playerCount)));
    } catch (e) { /* corrupt storage — fall back to defaults */ }
  }

  // ---------- screen wake lock (best effort) ----------

  async function acquireWakeLock() {
    try {
      wakeLock = await navigator.wakeLock?.request("screen");
    } catch (e) { /* unsupported or blocked — the game works without it */ }
  }

  function releaseWakeLock() {
    try {
      wakeLock?.release();
    } catch (e) { /* ignore */ }
    wakeLock = null;
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && round.active) acquireWakeLock();
  });

  // ---------- navigation ----------

  function show(screenId) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $(screenId).classList.add("active");
    window.scrollTo(0, 0);
  }

  function disarmEndRound() {
    if (endArmTimeout !== null) {
      clearTimeout(endArmTimeout);
      endArmTimeout = null;
    }
    $("end-hint").classList.add("hidden");
  }

  function endRound() {
    round.active = false;
    releaseWakeLock();
    stopTimer();
    renderSetup();
    show("screen-setup");
  }

  // ---------- game settings screen ----------

  function categorySummary() {
    if (settings.categories.length === 0) return "No categories selected";
    if (settings.categories.length === ALL_KEYS.length) return "All categories";
    const labels = settings.categories.map((k) => WORDS[k].label);
    if (labels.length <= 3) return labels.join(", ");
    return `${labels.slice(0, 3).join(", ")} +${labels.length - 3}`;
  }

  function renderSetup() {
    $("players-count").textContent = settings.playerCount;
    $("players-minus").disabled = settings.playerCount <= 3;
    $("players-plus").disabled = settings.playerCount >= 12;

    const cap = maxImposters(settings.playerCount);
    settings.imposterCount = Math.min(settings.imposterCount, cap);
    $("imposters-count").textContent = settings.imposterCount;
    $("imposters-minus").disabled = settings.imposterCount <= 1;
    $("imposters-plus").disabled = settings.imposterCount >= cap;

    $("mode-word").classList.toggle("mode-selected", settings.mode === "word");
    $("mode-question").classList.toggle("mode-selected", settings.mode === "question");
    $("word-only-settings").classList.toggle("hidden", settings.mode === "question");

    $("cat-summary").textContent = categorySummary();
    $("btn-start").disabled = settings.mode === "word" && settings.categories.length === 0;

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

    document.querySelectorAll("#difficulty-chips .chip").forEach((chip) => {
      chip.classList.toggle("chip-selected", chip.dataset.difficulty === settings.difficulty);
    });
    document.querySelectorAll("#timer-chips .chip").forEach((chip) => {
      chip.classList.toggle("chip-selected", Number(chip.dataset.timer) === settings.timerSeconds);
    });
    $("hint-toggle").checked = settings.showHint;
    $("first-toggle").checked = settings.imposterCanStart;
  }

  // ---------- category selection screen ----------

  function updateSelectToggle() {
    $("btn-select-toggle").textContent =
      settings.categories.length > 0 ? "Deselect all" : "Select all";
  }

  function renderCategories() {
    updateSelectToggle();
    const grid = $("cat-grid");
    grid.innerHTML = "";
    for (const key of ALL_KEYS) {
      const cat = WORDS[key];
      const count = cat.easy.length + cat.medium.length + cat.hard.length;
      const card = document.createElement("button");
      card.className = "cat-card";
      card.dataset.category = key;
      card.classList.toggle("cat-selected", settings.categories.includes(key));
      card.innerHTML =
        `<span class="cat-check"><svg><use href="#i-check"/></svg></span>` +
        `<span class="cat-name">${cat.emoji} ${esc(cat.label)}</span>` +
        `<span class="cat-count">${count} words</span>`;
      card.addEventListener("click", () => {
        const i = settings.categories.indexOf(key);
        if (i >= 0) {
          settings.categories.splice(i, 1);
        } else {
          settings.categories.push(key);
        }
        card.classList.toggle("cat-selected", settings.categories.includes(key));
        updateSelectToggle();
        saveSettings();
      });
      grid.appendChild(card);
    }
  }

  // ---------- round lifecycle ----------

  function difficultyPool(cat) {
    if (settings.difficulty === "mixed") {
      return [...cat.easy, ...cat.medium, ...cat.hard];
    }
    return cat[settings.difficulty];
  }

  function pickWord() {
    const entries = settings.categories.flatMap((key) =>
      difficultyPool(WORDS[key]).map((word) => ({ key, word }))
    );
    let fresh = entries.filter((e) => !usedWords.has(e.word));
    if (fresh.length === 0) {
      // Pool exhausted this session — allow repeats again.
      entries.forEach((e) => usedWords.delete(e.word));
      fresh = entries;
    }
    const pick = sample(fresh);
    usedWords.add(pick.word);
    round.categoryKey = pick.key;
    round.word = pick.word;
  }

  function pickQuestions() {
    let fresh = QUESTIONS.filter((pair) => !usedQuestions.has(pair[0]));
    if (fresh.length === 0) {
      usedQuestions.clear();
      fresh = QUESTIONS;
    }
    const pair = sample(fresh);
    usedQuestions.add(pair[0]);
    // Randomly decide which question is the group's and which the imposter's.
    const flip = Math.random() < 0.5;
    round.question = flip ? pair[1] : pair[0];
    round.imposterQuestion = flip ? pair[0] : pair[1];
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
    round.mode = settings.mode;
    if (round.mode === "word") {
      pickWord();
    } else {
      pickQuestions();
    }
    assignRoles();
    round.active = true;
    round.viewed = Array(settings.playerCount).fill(false);
    round.current = -1;
    round.revealed = false;
    round.discussionStarted = false;
    if (settings.imposterCanStart) {
      round.starter = randomInt(settings.playerCount);
    } else {
      const innocents = [...Array(settings.playerCount).keys()]
        .filter((i) => !round.imposters.includes(i));
      round.starter = sample(innocents);
    }
    round.clockwise = Math.random() < 0.5;
    accused = -1;
    acquireWakeLock();
    renderPlayers();
    $("players-sub").textContent =
      round.mode === "word"
        ? "Tap your name to reveal your word, then pass the device to the next player."
        : "Tap your name to reveal your question, then pass the device to the next player.";
    show("screen-players");
  }

  // ---------- players grid ----------

  function renderPlayers() {
    disarmEndRound();
    const grid = $("player-grid");
    grid.innerHTML = "";
    for (let i = 0; i < settings.playerCount; i++) {
      const card = document.createElement("button");
      card.className = "player-card";
      card.classList.toggle("viewed", round.viewed[i]);
      card.innerHTML =
        (round.viewed[i] ? `<span class="viewed-badge"><svg><use href="#i-check"/></svg></span>` : "") +
        `<span class="avatar">${esc(initial(i))}</span>` +
        `<span class="p-name">${esc(playerName(i))}</span>`;
      card.addEventListener("click", () => openReveal(i));
      grid.appendChild(card);
    }
    $("btn-to-discussion").classList.toggle("hidden", !round.viewed.every(Boolean));
  }

  // ---------- word / question reveal ----------

  function drawConfetti() {
    const canvas = $("confetti-canvas");
    const box = $("word-box");
    const dpr = window.devicePixelRatio || 1;
    const w = box.clientWidth || 340;
    const h = box.clientHeight || 238;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    const colors = ["#f9a8d4", "#a7f3d0", "#c4b5fd", "#fda4af", "#93c5fd", "#fde68a", "#99f6e4"];
    const count = Math.round((w * h) / 900);
    for (let i = 0; i < count; i++) {
      ctx.globalAlpha = 0.55 + Math.random() * 0.45;
      ctx.fillStyle = colors[randomInt(colors.length)];
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, 2 + Math.random() * 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  window.addEventListener("resize", () => {
    if ($("screen-word").classList.contains("active") && !round.revealed) {
      drawConfetti();
    }
  });

  function openReveal(i) {
    round.current = i;
    round.revealed = false;

    const isImposter = round.imposters.includes(i);
    $("word-player-name").textContent = playerName(i);

    if (round.mode === "word") {
      $("word-for-label").textContent = "The word for";
      const cat = WORDS[round.categoryKey];
      $("word-category").textContent =
        isImposter && !settings.showHint
          ? "Category: ???"
          : `Category: ${cat.label}`;
      $("word-category").classList.remove("hidden");
    } else {
      $("word-for-label").textContent = "The question for";
      $("word-category").classList.add("hidden");
    }

    $("word-box").classList.remove("revealed");
    $("word-content").classList.add("hidden");
    $("tap-hint").classList.remove("hidden");
    $("btn-got-it").classList.add("hidden");

    show("screen-word");
    requestAnimationFrame(drawConfetti);
  }

  function reveal() {
    if (round.revealed) return;
    round.revealed = true;

    const isImposter = round.imposters.includes(round.current);
    const text = $("word-text");
    const note = $("word-note");

    if (round.mode === "word") {
      text.classList.remove("question-text");
      if (isImposter) {
        text.textContent = "You're the Imposter!";
        text.classList.add("imposter-text");
        note.textContent = "You don't know the word — listen closely and blend in.";
        note.classList.remove("hidden");
      } else {
        text.textContent = round.word;
        text.classList.remove("imposter-text");
        note.classList.add("hidden");
      }
    } else {
      // Question mode: nobody learns their role — the imposter just gets
      // a different question and doesn't know it.
      text.classList.add("question-text");
      text.classList.remove("imposter-text");
      text.textContent = isImposter ? round.imposterQuestion : round.question;
      note.textContent = "Remember it — you'll answer out loud.";
      note.classList.remove("hidden");
    }

    $("word-box").classList.add("revealed");
    $("word-content").classList.remove("hidden");
    $("tap-hint").classList.add("hidden");
    $("btn-got-it").classList.remove("hidden");
  }

  function closeReveal(markViewed) {
    if (markViewed || round.revealed) {
      round.viewed[round.current] = true;
    }
    round.current = -1;
    round.revealed = false;
    renderPlayers();
    show("screen-players");
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

  function pauseTimer() {
    stopTimer();
    if (timerRemaining > 0 && timerRemaining < settings.timerSeconds) {
      $("btn-timer-toggle").textContent = "Resume Timer";
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
      pauseTimer();
      return;
    }
    $("btn-timer-toggle").textContent = "Pause Timer";
    timerId = setInterval(() => {
      timerRemaining -= 1;
      updateTimerDisplay();
      if (timerRemaining <= 0) {
        stopTimer();
        $("btn-timer-toggle").textContent = "Time's Up";
        try { navigator.vibrate?.([300, 120, 300]); } catch (e) { /* unsupported */ }
      }
    }, 1000);
  }

  function startDiscussion() {
    $("starter-avatar").textContent = initial(round.starter);
    $("starter-name").textContent = playerName(round.starter);
    $("starter-direction").textContent = round.clockwise
      ? "then continue clockwise ↻"
      : "then continue counter-clockwise ↺";

    if (round.mode === "word") {
      $("discussion-sub").textContent = "One clue word each, then debate. When you're ready, take the vote.";
      $("starter-label").textContent = "First clue";
      $("btn-review-words").textContent = "Forgot your word? Review";
      const showCat = settings.showHint;
      $("discussion-category").classList.toggle("hidden", !showCat);
      if (showCat) {
        $("discussion-category").textContent = `Category: ${WORDS[round.categoryKey].label}`;
      }
    } else {
      $("discussion-sub").textContent = "Everyone answers their own question out loud. One answer won't quite fit…";
      $("starter-label").textContent = "First answer";
      $("btn-review-words").textContent = "Forgot your question? Review";
      $("discussion-category").classList.add("hidden");
    }

    stopTimer();
    const hasTimer = settings.timerSeconds > 0;
    $("timer-block").classList.toggle("hidden", !hasTimer);
    if (!round.discussionStarted) {
      // First visit this round — arm the timer fresh. Coming back from a
      // word review keeps whatever time was left.
      timerRemaining = settings.timerSeconds;
      if (hasTimer) $("btn-timer-toggle").textContent = "Start Timer";
    } else if (hasTimer && timerRemaining > 0 && timerRemaining < settings.timerSeconds) {
      $("btn-timer-toggle").textContent = "Resume Timer";
    }
    round.discussionStarted = true;
    if (hasTimer) updateTimerDisplay();
    show("screen-discussion");
  }

  // ---------- vote & result ----------

  function renderVote() {
    accused = -1;
    $("vote-title").textContent =
      round.mode === "word" ? "Who is the imposter?" : "Who got a different question?";
    $("btn-confirm-vote").classList.add("hidden");
    const grid = $("vote-grid");
    grid.innerHTML = "";
    for (let i = 0; i < settings.playerCount; i++) {
      const card = document.createElement("button");
      card.className = "player-card";
      card.innerHTML =
        `<span class="avatar">${esc(initial(i))}</span>` +
        `<span class="p-name">${esc(playerName(i))}</span>`;
      card.addEventListener("click", () => {
        accused = i;
        grid.querySelectorAll(".player-card").forEach((c, j) => {
          c.classList.toggle("vote-selected", j === i);
        });
        $("btn-confirm-vote").classList.remove("hidden");
      });
      grid.appendChild(card);
    }
  }

  function imposterNames() {
    return round.imposters.map(playerName);
  }

  function finishRound(accusedIndex) {
    round.active = false;
    releaseWakeLock();
    stopTimer();
    const names = imposterNames();
    const namesText = names.map(esc).join(" & ");
    const plural = names.length > 1;
    const isWord = round.mode === "word";

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
      sub.textContent = `${playerName(accusedIndex)} ${isWord ? `was ${plural ? "an" : "the"} imposter` : "got a different question"}.`;
      if (isWord) {
        steal.classList.remove("hidden");
        steal.textContent = `🎭 Last chance: if ${playerName(accusedIndex)} can guess the secret word out loud right now, the imposter${plural ? "s" : ""} steal${plural ? "" : "s"} the win!`;
      } else {
        steal.classList.add("hidden");
      }
    } else {
      scores.imposters += 1;
      emoji.textContent = "😈";
      title.textContent = plural ? "The Imposters Win!" : "The Imposter Wins!";
      title.classList.add("lose");
      sub.textContent = `${playerName(accusedIndex)} ${isWord ? "was innocent" : "had the same question as everyone else"}.`;
      steal.classList.add("hidden");
    }

    const wordEl = $("result-word");
    if (isWord) {
      const cat = WORDS[round.categoryKey];
      $("result-word-label").textContent = "The secret word was";
      wordEl.textContent = round.word;
      wordEl.classList.remove("question-word");
      $("result-imposter-q").classList.add("hidden");
      $("result-imposters").innerHTML =
        `${cat.emoji} ${esc(cat.label)} · ${plural ? "Imposters" : "Imposter"}: <strong>${namesText}</strong>`;
    } else {
      $("result-word-label").textContent = "The group's question was";
      wordEl.textContent = round.question;
      wordEl.classList.add("question-word");
      $("result-imposter-q").classList.remove("hidden");
      $("result-imposter-q-text").textContent = round.imposterQuestion;
      $("result-imposters").innerHTML =
        `Different question: <strong>${namesText}</strong>`;
    }

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
      btn.addEventListener("click", () => {
        if (btn.dataset.back === "screen-setup") renderSetup();
        show(btn.dataset.back);
      });
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

    $("mode-word").addEventListener("click", () => {
      settings.mode = "word";
      saveSettings();
      renderSetup();
    });
    $("mode-question").addEventListener("click", () => {
      settings.mode = "question";
      saveSettings();
      renderSetup();
    });

    $("btn-open-categories").addEventListener("click", () => {
      renderCategories();
      show("screen-categories");
    });
    $("btn-select-toggle").addEventListener("click", () => {
      settings.categories = settings.categories.length > 0 ? [] : [...ALL_KEYS];
      saveSettings();
      renderCategories();
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
    $("first-toggle").addEventListener("change", (e) => {
      settings.imposterCanStart = e.target.checked;
      saveSettings();
    });

    $("btn-start").addEventListener("click", startRound);

    // Ending a round mid-way needs a second tap to confirm.
    $("btn-end-round").addEventListener("click", () => {
      if (endArmTimeout !== null) {
        disarmEndRound();
        endRound();
        return;
      }
      $("end-hint").classList.remove("hidden");
      endArmTimeout = setTimeout(disarmEndRound, 2500);
    });

    $("word-box").addEventListener("click", reveal);
    $("btn-got-it").addEventListener("click", () => closeReveal(true));
    $("btn-word-back").addEventListener("click", () => closeReveal(false));

    $("btn-to-discussion").addEventListener("click", startDiscussion);
    $("btn-discussion-back").addEventListener("click", () => {
      pauseTimer();
      renderPlayers();
      show("screen-players");
    });
    $("btn-review-words").addEventListener("click", () => {
      pauseTimer();
      renderPlayers();
      show("screen-players");
    });

    $("btn-timer-toggle").addEventListener("click", toggleTimer);
    $("btn-to-vote").addEventListener("click", () => {
      pauseTimer();
      renderVote();
      show("screen-vote");
    });
    $("btn-vote-back").addEventListener("click", () => show("screen-discussion"));
    $("btn-confirm-vote").addEventListener("click", () => {
      if (accused >= 0) finishRound(accused);
    });
    $("btn-no-vote").addEventListener("click", () => finishRound(null));

    $("btn-play-again").addEventListener("click", startRound);
    $("btn-change-setup").addEventListener("click", () => {
      renderSetup();
      show("screen-setup");
    });
  }

  loadSettings();
  renderSetup();
  bind();

  // Installable app: offline cache via service worker (http/https only —
  // silently skipped on file:// and hosts that don't allow it).
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
