# 🎭 Imposter

A pass-and-play party game of strategy and bluffing, inspired by [Find the Imposter](https://apps.apple.com/app/id6745120053). Everyone gets the secret word — except the imposter. Give clues, debate, and vote to expose the imposter before they bluff their way to victory.

Built as a dependency-free web app: one phone, no internet, no install.

## How to play

1. **Deal the roles.** Pass the phone around — everyone secretly sees the secret word, except the imposter.
2. **Give clues.** Going around the circle, each player says one word related to the secret word. The imposter improvises to blend in.
3. **Discuss and vote.** Debate who doesn't seem to know the word, then record the group's accusation.
4. **Reveal.** Catch the imposter and they get one last chance to guess the word and steal the win. Accuse an innocent player, and the imposter wins.

## Features

- 🎭 3–12 players with editable names, 1–3 imposters
- 📚 9 categories × 3 difficulty levels (~430 words), or fully random
- ⏱️ Optional discussion timer (1–5 minutes)
- 💡 Optional category hint for the imposter
- 🏆 Running score across rounds, with a fresh word every round
- 📴 Fully offline, no dependencies — plain HTML/CSS/JS

## Run it

Open `index.html` in any browser — that's it. For a local server:

```sh
npx serve .
# or
python3 -m http.server
```

It's a static site, so it can be hosted anywhere (GitHub Pages works out of the box).

## Project structure

```
index.html      All screens (home, setup, reveal, discussion, vote, result)
css/style.css   Dark party-game theme, mobile-first
js/words.js     Word lists: 9 categories × easy/medium/hard
js/app.js       Game state, role dealing, timer, voting, scoring
```

## The original app

This project is a web homage to the iOS game that inspired it:

[![Download on the App Store](https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg)](https://apps.apple.com/app/id6745120053)
