/**
 * ==========================================================================
 * LEXIQ - Word Guessing Game Logic
 * College AI Tools Mini-Project
 * 
 * Clean, modular, beginner-friendly Vanilla JavaScript.
 * Contains:
 *  - State management
 *  - Wordle-style two-pass letter evaluation
 *  - Virtual & physical keyboard synchronization
 *  - Smart hints engine (letter position + semantic clues)
 *  - Scoring and streak tracking with localStorage
 *  - Web Audio API zero-dependency sound effects
 * ==========================================================================
 */

// --- Game Configuration & Constants ---
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const HINT_PENALTY = 15; // Points deducted per hint used

const SCORE_TABLE = {
  1: 100,
  2: 90,
  3: 80,
  4: 70,
  5: 60,
  6: 50
};

// Keyboard layout rows
const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"]
];

// --- Application State ---
const state = {
  secretWord: "",
  secretClue: "",
  currentRow: 0,
  currentCol: 0,
  currentGuess: "",
  isGameOver: false,
  isAnimating: false,
  hintsUsed: 0,
  boardLetters: Array.from({ length: MAX_ATTEMPTS }, () => Array(WORD_LENGTH).fill("")),
  keyboardLetterStatus: {}, // 'A': 'correct' | 'present' | 'absent'
  stats: {
    played: 0,
    wins: 0,
    currentStreak: 0,
    bestStreak: 0,
    bestScore: 0,
    lastScore: 0
  },
  soundEnabled: true,
  theme: "dark"
};

// Web Audio API context reference (initialized on first interaction)
let audioCtx = null;

// --- DOM Elements ---
const DOM = {
  board: document.getElementById("board"),
  attemptIndicator: document.getElementById("attempt-indicator"),
  streakIndicator: document.getElementById("streak-indicator"),
  bestIndicator: document.getElementById("best-indicator"),
  hintIndicator: document.getElementById("hint-indicator"),
  btnHint: document.getElementById("btn-hint"),
  btnHintText: document.getElementById("btn-hint-text"),
  btnNewGame: document.getElementById("btn-new-game"),
  toastContainer: document.getElementById("toast-container"),
  
  // Modals
  modalHelp: document.getElementById("modal-help"),
  modalStats: document.getElementById("modal-stats"),
  modalGameOver: document.getElementById("modal-gameover"),
  modalAbout: document.getElementById("modal-about"),
  
  // Header Buttons
  btnHelp: document.getElementById("btn-help"),
  btnStats: document.getElementById("btn-stats"),
  btnAbout: document.getElementById("btn-about"),
  btnTheme: document.getElementById("btn-theme"),
  btnSound: document.getElementById("btn-sound"),
  soundIconOn: document.getElementById("sound-icon-on"),
  soundIconOff: document.getElementById("sound-icon-off"),
  themeSun: document.getElementById("theme-sun"),
  themeMoon: document.getElementById("theme-moon"),
  
  // Result Modal Elements
  resultEmoji: document.getElementById("result-emoji"),
  resultTitle: document.getElementById("result-title"),
  resultSubtitle: document.getElementById("result-subtitle"),
  resultWord: document.getElementById("result-word"),
  resultClue: document.getElementById("result-clue"),
  resAttempts: document.getElementById("res-attempts"),
  resScore: document.getElementById("res-score"),
  resStreak: document.getElementById("res-streak"),
  btnPlayAgain: document.getElementById("btn-play-again"),
  
  // Stats Modal Elements
  statPlayed: document.getElementById("stat-played"),
  statWins: document.getElementById("stat-wins"),
  statWinPct: document.getElementById("stat-win-pct"),
  statStreak: document.getElementById("stat-streak"),
  statMaxStreak: document.getElementById("stat-max-streak"),
  statBestScore: document.getElementById("stat-best-score"),
  statLastScore: document.getElementById("stat-last-score"),
  btnStatsReset: document.getElementById("btn-stats-reset")
};

// ==========================================================================
// Sound Engine (Web Audio API - 100% Offline, Zero External Assets)
// ==========================================================================
function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function playSound(type) {
  if (!state.soundEnabled) return;
  try {
    initAudioContext();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    switch (type) {
      case "type": {
        // Subtle crisp keyboard pop
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case "reveal": {
        // Tile reveal flip chime
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(560, now + 0.09);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
        break;
      }

      case "invalid": {
        // Low buzz warning
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.setValueAtTime(120, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
        break;
      }

      case "win": {
        // Pleasant victorious arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.15, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.35);
        });
        break;
      }

      case "gameover": {
        // Gentle descending minor cadence
        const notes = [330.0, 293.66, 246.94];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.15);
          gain.gain.setValueAtTime(0.12, now + idx * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.3);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.15);
          osc.stop(now + idx * 0.15 + 0.35);
        });
        break;
      }
    }
  } catch (err) {
    // Graceful fallback if browser restricts audio
    console.debug("Audio playback ignored:", err);
  }
}

// ==========================================================================
// Word Validation & Matching Logic (Two-Pass Evaluation)
// ==========================================================================

/**
 * Evaluates a guess against the secret word using a two-pass algorithm.
 * Handles repeated letters accurately (standard Wordle rules).
 * 
 * @param {string} guess - 5-letter guess in uppercase
 * @param {string} secret - 5-letter target word in uppercase
 * @returns {Array<string>} Array of statuses: 'correct' | 'present' | 'absent'
 */
function checkGuess(guess, secret) {
  const result = Array(WORD_LENGTH).fill("absent");
  const secretLetterCount = {};

  // Count frequencies of each letter in the secret word
  for (let i = 0; i < secret.length; i++) {
    const char = secret[i];
    secretLetterCount[char] = (secretLetterCount[char] || 0) + 1;
  }

  // --- PASS 1: Mark exact matches ('correct' / green) ---
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === secret[i]) {
      result[i] = "correct";
      secretLetterCount[guess[i]]--;
    }
  }

  // --- PASS 2: Mark misplaced letters ('present' / yellow) ---
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] !== "correct") {
      const char = guess[i];
      if (secretLetterCount[char] && secretLetterCount[char] > 0) {
        result[i] = "present";
        secretLetterCount[char]--;
      } else {
        result[i] = "absent";
      }
    }
  }

  return result;
}

// ==========================================================================
// Board & Keyboard Initialization
// ==========================================================================

function buildBoard() {
  DOM.board.innerHTML = "";
  for (let r = 0; r < MAX_ATTEMPTS; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "board-row";
    rowEl.id = `board-row-${r}`;
    rowEl.setAttribute("role", "row");

    for (let c = 0; c < WORD_LENGTH; c++) {
      const cellEl = document.createElement("div");
      cellEl.className = "board-cell";
      cellEl.id = `cell-${r}-${c}`;
      cellEl.setAttribute("role", "gridcell");
      cellEl.setAttribute("aria-label", `Row ${r + 1}, Letter ${c + 1}`);
      rowEl.appendChild(cellEl);
    }
    DOM.board.appendChild(rowEl);
  }
}

function buildKeyboard() {
  KEYBOARD_ROWS.forEach((row, rowIdx) => {
    const rowContainer = document.getElementById(`kb-row-${rowIdx + 1}`);
    if (!rowContainer) return;
    rowContainer.innerHTML = "";

    row.forEach(key => {
      const keyBtn = document.createElement("button");
      keyBtn.className = "key-btn";
      keyBtn.dataset.key = key;

      if (key === "ENTER") {
        keyBtn.classList.add("key-wide");
        keyBtn.textContent = "ENTER";
        keyBtn.setAttribute("aria-label", "Submit Guess");
      } else if (key === "BACKSPACE") {
        keyBtn.classList.add("key-wide");
        keyBtn.innerHTML = `⌫`;
        keyBtn.setAttribute("aria-label", "Backspace / Delete Letter");
      } else {
        keyBtn.textContent = key;
        keyBtn.id = `key-${key}`;
        keyBtn.setAttribute("aria-label", `Letter ${key}`);
      }

      keyBtn.addEventListener("click", () => handleKeyInput(key));
      rowContainer.appendChild(keyBtn);
    });
  });
}

// ==========================================================================
// Gameplay Mechanics & Input Handlers
// ==========================================================================

function handleKeyInput(key) {
  if (state.isGameOver || state.isAnimating) return;

  initAudioContext();

  if (key === "ENTER") {
    submitGuess();
  } else if (key === "BACKSPACE") {
    deleteLetter();
  } else if (/^[A-Z]$/.test(key)) {
    addLetter(key);
  }
}

function addLetter(letter) {
  if (state.currentCol >= WORD_LENGTH) return;

  const cell = document.getElementById(`cell-${state.currentRow}-${state.currentCol}`);
  if (cell) {
    cell.textContent = letter;
    cell.classList.add("filled");
    state.currentGuess += letter;
    state.currentCol++;
    playSound("type");
  }
}

function deleteLetter() {
  if (state.currentCol <= 0) return;

  state.currentCol--;
  state.currentGuess = state.currentGuess.slice(0, -1);
  const cell = document.getElementById(`cell-${state.currentRow}-${state.currentCol}`);
  if (cell) {
    cell.textContent = "";
    cell.classList.remove("filled");
    playSound("type");
  }
}

function submitGuess() {
  const guess = state.currentGuess.toUpperCase();

  // 1. Length validation
  if (guess.length !== WORD_LENGTH) {
    showToast("Please enter a 5-letter word");
    shakeRow(state.currentRow);
    playSound("invalid");
    return;
  }

  // 2. Dictionary validation
  if (typeof VALID_WORD_SET !== "undefined" && !VALID_WORD_SET.has(guess)) {
    showToast("Not a valid word");
    shakeRow(state.currentRow);
    playSound("invalid");
    return;
  }

  // 3. Evaluate Guess
  state.isAnimating = true;
  const evaluation = checkGuess(guess, state.secretWord);
  const currentRowEl = document.getElementById(`board-row-${state.currentRow}`);

  // 4. Staggered tile flip animations
  for (let c = 0; c < WORD_LENGTH; c++) {
    const cell = document.getElementById(`cell-${state.currentRow}-${c}`);
    const status = evaluation[c];
    const letter = guess[c];

    setTimeout(() => {
      cell.classList.add("flip");
      playSound("reveal");

      // Mid-flip: update colors
      setTimeout(() => {
        cell.classList.remove("filled");
        cell.classList.add(status);
        updateKeyboardKey(letter, status);
      }, 250);
    }, c * 160);
  }

  // 5. Post-Evaluation Game State Update (after all 5 tiles flip)
  setTimeout(() => {
    state.isAnimating = false;

    const isWin = (guess === state.secretWord);
    if (isWin) {
      celebrateWin(state.currentRow);
      endGame(true);
    } else if (state.currentRow + 1 >= MAX_ATTEMPTS) {
      endGame(false);
    } else {
      // Advance to next row
      state.currentRow++;
      state.currentCol = 0;
      state.currentGuess = "";
      updateStatusUI();
    }
  }, WORD_LENGTH * 160 + 300);
}

function shakeRow(rowIdx) {
  const row = document.getElementById(`board-row-${rowIdx}`);
  if (!row) return;
  row.classList.remove("shake");
  void row.offsetWidth; // Force reflow
  row.classList.add("shake");
  setTimeout(() => row.classList.remove("shake"), 500);
}

function celebrateWin(rowIdx) {
  const row = document.getElementById(`board-row-${rowIdx}`);
  if (!row) return;
  const cells = row.querySelectorAll(".board-cell");
  cells.forEach((cell, i) => {
    setTimeout(() => {
      cell.classList.add("bounce");
    }, i * 90);
  });
}

function updateKeyboardKey(letter, newStatus) {
  const keyBtn = document.getElementById(`key-${letter}`);
  if (!keyBtn) return;

  const currentStatus = state.keyboardLetterStatus[letter];

  // Priority: correct (green) > present (yellow) > absent (gray)
  if (currentStatus === "correct") return;
  if (currentStatus === "present" && newStatus === "absent") return;

  keyBtn.classList.remove("correct", "present", "absent");
  keyBtn.classList.add(newStatus);
  state.keyboardLetterStatus[letter] = newStatus;
}

// ==========================================================================
// Hints Engine (Max 2 per game)
// ==========================================================================

function useHint() {
  if (state.isGameOver || state.hintsUsed >= 2) return;

  initAudioContext();

  if (state.hintsUsed === 0) {
    // --- Hint 1: Reveal one correct letter and its position ---
    // Look for a position the player hasn't correctly guessed yet
    const revealedIndices = [];
    for (let r = 0; r < state.currentRow; r++) {
      for (let c = 0; c < WORD_LENGTH; c++) {
        const cell = document.getElementById(`cell-${r}-${c}`);
        if (cell && cell.classList.contains("correct")) {
          revealedIndices.push(c);
        }
      }
    }

    const availableIndices = [];
    for (let c = 0; c < WORD_LENGTH; c++) {
      if (!revealedIndices.includes(c)) {
        availableIndices.push(c);
      }
    }

    // Pick an unrevealed index, or default to random position
    const targetIndex = availableIndices.length > 0 
      ? availableIndices[Math.floor(Math.random() * availableIndices.length)]
      : 0;

    const letter = state.secretWord[targetIndex];
    const posSuffix = getOrdinalSuffix(targetIndex + 1);

    showToast(`💡 Hint 1: The ${targetIndex + 1}${posSuffix} letter is "${letter}"`, 4500);
    state.hintsUsed = 1;

  } else if (state.hintsUsed === 1) {
    // --- Hint 2: Give a contextual semantic clue ---
    const clueText = state.secretClue || "A common English noun/verb.";
    showToast(`💡 Hint 2: Clue — "${clueText}"`, 5500);
    state.hintsUsed = 2;
  }

  updateHintButton();
  updateStatusUI();
  playSound("type");
}

function getOrdinalSuffix(num) {
  if (num === 1) return "st";
  if (num === 2) return "nd";
  if (num === 3) return "rd";
  return "th";
}

function updateHintButton() {
  const remaining = 2 - state.hintsUsed;
  DOM.hintIndicator.textContent = remaining;
  DOM.btnHintText.textContent = `Hint (${remaining})`;

  if (remaining <= 0) {
    DOM.btnHint.disabled = true;
  } else {
    DOM.btnHint.disabled = false;
  }
}

// ==========================================================================
// Scoring & Statistics (Stored in localStorage)
// ==========================================================================

function calculateScore(attempts, hints) {
  const base = SCORE_TABLE[attempts] || 50;
  const penalty = hints * HINT_PENALTY;
  return Math.max(0, base - penalty);
}

function loadStats() {
  try {
    const saved = localStorage.getItem("lexiq_stats");
    if (saved) {
      const parsed = JSON.parse(saved);
      state.stats = { ...state.stats, ...parsed };
    }
  } catch (e) {
    console.warn("Could not load stats from localStorage", e);
  }
  updateStatsDisplay();
}

function saveStats() {
  try {
    localStorage.setItem("lexiq_stats", JSON.stringify(state.stats));
  } catch (e) {
    console.warn("Could not save stats to localStorage", e);
  }
  updateStatsDisplay();
}

function updateStatsDisplay() {
  const { played, wins, currentStreak, bestStreak, bestScore, lastScore } = state.stats;
  const winPct = played > 0 ? Math.round((wins / played) * 100) : 0;

  DOM.streakIndicator.textContent = currentStreak;
  DOM.bestIndicator.textContent = bestStreak;

  DOM.statPlayed.textContent = played;
  DOM.statWins.textContent = wins;
  DOM.statWinPct.textContent = `${winPct}%`;
  DOM.statStreak.textContent = currentStreak;
  DOM.statMaxStreak.textContent = bestStreak;
  DOM.statBestScore.textContent = `${bestScore} pts`;
  DOM.statLastScore.textContent = `${lastScore} pts`;
}

function updateStatistics(isWin, attempts) {
  state.stats.played++;

  let finalScore = 0;
  if (isWin) {
    state.stats.wins++;
    state.stats.currentStreak++;
    if (state.stats.currentStreak > state.stats.bestStreak) {
      state.stats.bestStreak = state.stats.currentStreak;
    }

    finalScore = calculateScore(attempts, state.hintsUsed);
    if (finalScore > state.stats.bestScore) {
      state.stats.bestScore = finalScore;
    }
  } else {
    state.stats.currentStreak = 0;
    finalScore = 0;
  }

  state.stats.lastScore = finalScore;
  saveStats();
  return finalScore;
}

// ==========================================================================
// Game Over & Reset
// ==========================================================================

function endGame(isWin) {
  state.isGameOver = true;
  const attemptsTaken = state.currentRow + 1;
  const finalScore = updateStatistics(isWin, attemptsTaken);

  setTimeout(() => {
    if (isWin) {
      playSound("win");
      DOM.resultEmoji.textContent = "🎉";
      DOM.resultTitle.textContent = "Brilliant!";
      DOM.resultSubtitle.textContent = "You found the hidden word!";
      DOM.resAttempts.textContent = `${attemptsTaken} / ${MAX_ATTEMPTS}`;
      DOM.resScore.textContent = `${finalScore}`;
      DOM.resStreak.textContent = state.stats.currentStreak;
    } else {
      playSound("gameover");
      DOM.resultEmoji.textContent = "😔";
      DOM.resultTitle.textContent = "Game Over";
      DOM.resultSubtitle.textContent = "Better luck next time!";
      DOM.resAttempts.textContent = `X / ${MAX_ATTEMPTS}`;
      DOM.resScore.textContent = "0";
      DOM.resStreak.textContent = "0";
    }

    DOM.resultWord.textContent = state.secretWord;
    DOM.resultClue.textContent = state.secretClue ? `Clue: ${state.secretClue}` : "";

    openModal(DOM.modalGameOver);
  }, 700);
}

function startGame() {
  // Select new random word without repeating the previous secret word
  let candidate = null;
  const previousWord = state.secretWord;

  if (typeof TARGET_WORDS !== "undefined" && TARGET_WORDS.length > 0) {
    let attempts = 0;
    do {
      candidate = TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)];
      attempts++;
    } while (candidate.word.toUpperCase() === previousWord && attempts < 10);
  }

  if (candidate) {
    state.secretWord = candidate.word.toUpperCase();
    state.secretClue = candidate.clue || "";
  } else {
    // Fallback safe word
    state.secretWord = "APPLE";
    state.secretClue = "A popular crisp fruit.";
  }

  // Reset core round state
  state.currentRow = 0;
  state.currentCol = 0;
  state.currentGuess = "";
  state.isGameOver = false;
  state.isAnimating = false;
  state.hintsUsed = 0;
  state.keyboardLetterStatus = {};

  // Reset Board DOM
  buildBoard();

  // Reset Virtual Keyboard colors
  document.querySelectorAll(".key-btn").forEach(btn => {
    btn.classList.remove("correct", "present", "absent");
  });

  // Reset UI components
  updateHintButton();
  updateStatusUI();
  closeAllModals();

  console.log("%c[LexiQ Debug] Word selected:", "color: #22c55e; font-weight: bold;", state.secretWord);
}

function updateStatusUI() {
  const currentAttempt = Math.min(state.currentRow + 1, MAX_ATTEMPTS);
  DOM.attemptIndicator.textContent = `${currentAttempt} / ${MAX_ATTEMPTS}`;
  DOM.streakIndicator.textContent = state.stats.currentStreak;
  DOM.bestIndicator.textContent = state.stats.bestStreak;
}

// ==========================================================================
// Toast Messages & UI Helpers
// ==========================================================================

function showToast(message, duration = 2200) {
  const toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.textContent = message;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    toast.style.transition = "all 0.2s ease-out";
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

// ==========================================================================
// Modals & Navigation
// ==========================================================================

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove("hidden");
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add("hidden");
}

function closeAllModals() {
  document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.add("hidden"));
}

function setupModals() {
  // Triggers
  DOM.btnHelp.addEventListener("click", () => openModal(DOM.modalHelp));
  DOM.btnStats.addEventListener("click", () => {
    updateStatsDisplay();
    openModal(DOM.modalStats);
  });
  DOM.btnAbout.addEventListener("click", () => openModal(DOM.modalAbout));
  DOM.btnPlayAgain.addEventListener("click", () => {
    closeAllModals();
    startGame();
  });

  // Close buttons inside modals
  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal-backdrop");
      closeModal(modal);
    });
  });

  // Close on outside backdrop click
  document.querySelectorAll(".modal-backdrop").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Escape key closes modals
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });

  // Clear statistics button
  DOM.btnStatsReset.addEventListener("click", () => {
    if (confirm("Reset all statistics and streaks?")) {
      state.stats = {
        played: 0,
        wins: 0,
        currentStreak: 0,
        bestStreak: 0,
        bestScore: 0,
        lastScore: 0
      };
      saveStats();
      showToast("Statistics reset successfully");
    }
  });
}

// ==========================================================================
// Theme & Sound Settings
// ==========================================================================

function initTheme() {
  const savedTheme = localStorage.getItem("lexiq_theme") || "dark";
  setTheme(savedTheme);

  DOM.btnTheme.addEventListener("click", () => {
    const nextTheme = state.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("lexiq_theme", theme);

  if (theme === "dark") {
    DOM.themeMoon.classList.remove("hidden");
    DOM.themeSun.classList.add("hidden");
  } else {
    DOM.themeMoon.classList.add("hidden");
    DOM.themeSun.classList.remove("hidden");
  }
}

function initSound() {
  const savedSound = localStorage.getItem("lexiq_sound");
  state.soundEnabled = savedSound !== "false";
  updateSoundUI();

  DOM.btnSound.addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem("lexiq_sound", state.soundEnabled);
    updateSoundUI();
    if (state.soundEnabled) playSound("type");
  });
}

function updateSoundUI() {
  if (state.soundEnabled) {
    DOM.soundIconOn.classList.remove("hidden");
    DOM.soundIconOff.classList.add("hidden");
    DOM.btnSound.setAttribute("title", "Sound: Enabled");
  } else {
    DOM.soundIconOn.classList.add("hidden");
    DOM.soundIconOff.classList.remove("hidden");
    DOM.btnSound.setAttribute("title", "Sound: Muted");
  }
}

// ==========================================================================
// Physical Keyboard Listener
// ==========================================================================

function setupKeyboardListeners() {
  window.addEventListener("keydown", (e) => {
    // Ignore physical keys if a modal is open
    const isAnyModalOpen = Array.from(document.querySelectorAll(".modal-backdrop"))
      .some(m => !m.classList.contains("hidden"));
    if (isAnyModalOpen) return;

    if (e.key === "Enter") {
      e.preventDefault();
      handleKeyInput("ENTER");
    } else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      handleKeyInput("BACKSPACE");
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      handleKeyInput(e.key.toUpperCase());
    }
  });
}

// ==========================================================================
// Initialization Entry Point
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  buildBoard();
  buildKeyboard();
  loadStats();
  initTheme();
  initSound();
  setupModals();
  setupKeyboardListeners();

  // Button hooks
  DOM.btnHint.addEventListener("click", useHint);
  DOM.btnNewGame.addEventListener("click", startGame);

  // Start fresh game session
  startGame();
});
