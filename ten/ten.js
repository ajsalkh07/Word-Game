/**
 * ==========================================================================
 * TEN - 10-Second Reflex & Brain Blitz Engine
 * Part of SYNAPSE Mini-Game Platform
 * 
 * Features:
 *  - High-precision 10.0s continuous countdown with color urgency states
 *  - 10-round adaptive session
 *  - 8 distinct randomized challenges (Math, Odd One Out, Count, Pattern, Memory, Sort, Target, Reaction)
 *  - Combo multiplier & Speed-bonus scoring system
 *  - Native Web Audio API sound synthesizer
 *  - LocalStorage high-score persistence & detailed post-game analytics
 * ==========================================================================
 */

// --- Global Constants ---
const ROUND_TIME_LIMIT = 10.0; // 10.0 seconds
const MAX_ROUNDS = 10;

// Challenge Type Enums
const CHALLENGE_TYPES = [
  'MATH',
  'ODD_ONE_OUT',
  'COUNT',
  'PATTERN',
  'MEMORY',
  'SORT',
  'TARGET',
  'REACTION'
];

// --- Application State ---
const state = {
  activeScreen: 'start', // 'start' | 'game' | 'results'
  currentRound: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  roundStartTime: 0,
  timeRemaining: ROUND_TIME_LIMIT,
  isRoundActive: false,
  isTransitioning: false,
  timerAnimationId: null,
  
  // Analytics per session
  roundsCorrect: 0,
  responseTimes: [],
  bestScore: 0,
  soundEnabled: true,
  
  // Current active challenge data
  currentChallenge: null
};

// Web Audio API context reference
let audioCtx = null;

// --- DOM Cache ---
const DOM = {
  // Screens
  screenStart: document.getElementById('screen-start'),
  screenGame: document.getElementById('screen-game'),
  screenResults: document.getElementById('screen-results'),
  
  // Header Buttons
  btnHelp: document.getElementById('btn-help'),
  btnStartHelp: document.getElementById('btn-start-help'),
  btnSound: document.getElementById('btn-sound'),
  soundIconOn: document.getElementById('sound-icon-on'),
  soundIconOff: document.getElementById('sound-icon-off'),
  modalHelp: document.getElementById('modal-help'),
  
  // Start Screen Elements
  btnStartGame: document.getElementById('btn-start-game'),
  startBestScore: document.getElementById('start-best-score'),
  
  // Game HUD Elements
  hudRound: document.getElementById('hud-round'),
  hudDiff: document.getElementById('hud-diff'),
  hudCombo: document.getElementById('hud-combo'),
  hudScore: document.getElementById('hud-score'),
  
  // Timer Elements
  timerReadout: document.getElementById('timer-readout'),
  timerBar: document.getElementById('timer-bar'),
  
  // Challenge Elements
  challengeBadge: document.getElementById('challenge-type-badge'),
  challengeInstruction: document.getElementById('challenge-instruction'),
  challengeArena: document.getElementById('challenge-arena'),
  
  // Feedback Banner
  feedbackBanner: document.getElementById('feedback-banner'),
  feedbackIcon: document.getElementById('feedback-icon'),
  feedbackText: document.getElementById('feedback-text'),
  feedbackPoints: document.getElementById('feedback-points'),
  
  // Results Elements
  resultsMedal: document.getElementById('results-medal'),
  resultsCritique: document.getElementById('results-critique'),
  resultsFinalScore: document.getElementById('results-final-score'),
  resultsRecordBadge: document.getElementById('results-record-badge'),
  resAccuracy: document.getElementById('res-accuracy'),
  resBestCombo: document.getElementById('res-best-combo'),
  resAvgTime: document.getElementById('res-avg-time'),
  resAlltimeBest: document.getElementById('res-alltime-best'),
  btnPlayAgain: document.getElementById('btn-play-again'),
  
  // Toast
  toastContainer: document.getElementById('toast-container')
};

// ==========================================================================
// Web Audio API Synthesizer (100% Offline, Zero External Files)
// ==========================================================================
function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
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
      case 'tap': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case 'correct': {
        // High double-tone chime
        [523.25, 783.99].forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.12, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.25);
        });
        break;
      }

      case 'wrong': {
        // Low sawtooth buzz
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.setValueAtTime(120, now + 0.1);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }

      case 'tick': {
        // Rapid soft click for timer urgency
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.02);
        break;
      }

      case 'fanfare': {
        // Glorious ending cadence
        [440, 554.37, 659.25, 880].forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          gain.gain.setValueAtTime(0.14, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.4);
        });
        break;
      }
    }
  } catch (e) {
    console.debug('Audio error ignored:', e);
  }
}

// ==========================================================================
// Challenge Generators (8 Varied Types)
// ==========================================================================

function getDifficulty(round) {
  if (round <= 3) return 'EASY';
  if (round <= 7) return 'MEDIUM';
  return 'HARD';
}

/**
 * 1. Quick Math: Mental Arithmetic
 */
function generateQuickMath(diff) {
  let equation = '';
  let answer = 0;

  if (diff === 'EASY') {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    if (op === '+') {
      const a = randInt(12, 45);
      const b = randInt(8, 35);
      equation = `${a} + ${b}`;
      answer = a + b;
    } else if (op === '-') {
      const a = randInt(25, 70);
      const b = randInt(7, a - 5);
      equation = `${a} − ${b}`;
      answer = a - b;
    } else {
      const a = randInt(4, 9);
      const b = randInt(3, 9);
      equation = `${a} × ${b}`;
      answer = a * b;
    }
  } else if (diff === 'MEDIUM') {
    // Two-step e.g. a * b + c
    const a = randInt(4, 8);
    const b = randInt(3, 7);
    const c = randInt(5, 20);
    const op2 = Math.random() > 0.5 ? '+' : '−';
    if (op2 === '+') {
      equation = `${a} × ${b} + ${c}`;
      answer = a * b + c;
    } else {
      equation = `${a} × ${b} − ${c}`;
      answer = a * b - c;
    }
  } else {
    // HARD: Multi-step with larger numbers or division
    const a = randInt(11, 19);
    const b = randInt(3, 6);
    const c = randInt(8, 25);
    equation = `${a} × ${b} − ${c}`;
    answer = a * b - c;
  }

  // Generate 3 unique distractors close to answer
  const choices = generateDistractors(answer, 4);

  return {
    type: 'MATH',
    title: 'QUICK MATH',
    instruction: 'Solve the equation before time runs out:',
    render: (arena) => {
      arena.innerHTML = `
        <div class="equation-box">${equation} = ?</div>
        <div class="choices-grid">
          ${choices.map(c => `<button class="choice-btn" data-val="${c}">${c}</button>`).join('')}
        </div>
      `;
      arena.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.val, 10);
          handleAnswer(selected === answer);
        });
      });
    }
  };
}

/**
 * 2. Odd One Out: Find the unique symbol in a grid
 */
function generateOddOneOut(diff) {
  const symbolPairs = [
    { base: '●', odd: '○' },
    { base: '▲', odd: '▼' },
    { base: '■', odd: '◆' },
    { base: '★', odd: '✦' },
    { base: 'O', odd: 'Q' },
    { base: 'E', odd: 'F' }
  ];
  const pair = symbolPairs[Math.floor(Math.random() * symbolPairs.length)];
  
  let rows = 3, cols = 3;
  if (diff === 'MEDIUM') { rows = 3; cols = 4; }
  if (diff === 'HARD') { rows = 4; cols = 4; }
  const total = rows * cols;
  const oddIndex = randInt(0, total - 1);

  return {
    type: 'ODD_ONE_OUT',
    title: 'ODD ONE OUT',
    instruction: 'Tap the single symbol that is different:',
    render: (arena) => {
      let gridHtml = `<div class="symbol-grid" style="grid-template-columns: repeat(${cols}, 1fr);">`;
      for (let i = 0; i < total; i++) {
        const isOdd = (i === oddIndex);
        const char = isOdd ? pair.odd : pair.base;
        gridHtml += `<button class="symbol-cell" data-odd="${isOdd}">${char}</button>`;
      }
      gridHtml += `</div>`;
      arena.innerHTML = gridHtml;

      arena.querySelectorAll('.symbol-cell').forEach(btn => {
        btn.addEventListener('click', () => {
          const isCorrect = btn.dataset.odd === 'true';
          handleAnswer(isCorrect);
        });
      });
    }
  };
}

/**
 * 3. Count: Tally a specific shape in a mixed cluster
 */
function generateCount(diff) {
  const shapes = ['▲', '●', '■', '★'];
  const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
  const shapeNames = { '▲': 'triangles (▲)', '●': 'circles (●)', '■': 'squares (■)', '★': 'stars (★)' };

  let totalItems = diff === 'EASY' ? 8 : diff === 'MEDIUM' ? 12 : 15;
  let targetCount = randInt(2, Math.floor(totalItems * 0.6));
  
  const pool = [];
  for (let i = 0; i < targetCount; i++) pool.push(targetShape);
  while (pool.length < totalItems) {
    const s = shapes[Math.floor(Math.random() * shapes.length)];
    if (s !== targetShape) pool.push(s);
  }
  shuffleArray(pool);

  const choices = generateDistractors(targetCount, 4, 1);

  return {
    type: 'COUNT',
    title: 'COUNT',
    instruction: `How many ${shapeNames[targetShape]} are there?`,
    render: (arena) => {
      arena.innerHTML = `
        <div class="shapes-strip">${pool.join(' ')}</div>
        <div class="choices-grid">
          ${choices.map(c => `<button class="choice-btn" data-val="${c}">${c}</button>`).join('')}
        </div>
      `;
      arena.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.dataset.val, 10);
          handleAnswer(selected === targetCount);
        });
      });
    }
  };
}

/**
 * 4. Pattern: Predict the next element in a progression
 */
function generatePattern(diff) {
  let displayStr = '';
  let answer = '';
  let choices = [];

  const patternType = Math.random();

  if (patternType < 0.4 || diff === 'EASY') {
    // Alternating shapes
    const a = '▲', b = '●';
    displayStr = `${a}   ${b}   ${a}   ${b}   ${a}   ?`;
    answer = b;
    choices = [b, a, '■', '★'];
  } else if (patternType < 0.75) {
    // Arithmetic step progression
    const start = randInt(2, 15);
    const step = randInt(3, 7);
    const s1 = start;
    const s2 = s1 + step;
    const s3 = s2 + step;
    const s4 = s3 + step;
    answer = (s4 + step).toString();
    displayStr = `${s1},  ${s2},  ${s3},  ${s4},  ?`;
    choices = generateDistractors(parseInt(answer, 10), 4).map(String);
  } else {
    // Double progression
    const start = randInt(2, 5);
    const s1 = start;
    const s2 = s1 * 2;
    const s3 = s2 * 2;
    const s4 = s3 * 2;
    answer = (s4 * 2).toString();
    displayStr = `${s1},  ${s2},  ${s3},  ${s4},  ?`;
    choices = generateDistractors(parseInt(answer, 10), 4).map(String);
  }

  shuffleArray(choices);

  return {
    type: 'PATTERN',
    title: 'PATTERN',
    instruction: 'What comes next in the sequence?',
    render: (arena) => {
      arena.innerHTML = `
        <div class="sequence-box">${displayStr}</div>
        <div class="choices-grid">
          ${choices.map(c => `<button class="choice-btn" data-val="${c}">${c}</button>`).join('')}
        </div>
      `;
      arena.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          handleAnswer(btn.dataset.val === answer);
        });
      });
    }
  };
}

/**
 * 5. Memory: Memorize a sequence, then recall it
 */
function generateMemory(diff) {
  const length = diff === 'EASY' ? 4 : diff === 'MEDIUM' ? 5 : 6;
  const digits = Array.from({ length }, () => randInt(1, 9));
  const correctStr = digits.join(' ');

  // Create 3 realistic distractors
  const distractors = new Set();
  while (distractors.size < 3) {
    const alt = [...digits];
    const swapIdx = randInt(0, length - 1);
    alt[swapIdx] = (alt[swapIdx] % 9) + 1; // alter one digit
    const altStr = alt.join(' ');
    if (altStr !== correctStr) distractors.add(altStr);
  }

  const choices = [correctStr, ...distractors];
  shuffleArray(choices);

  return {
    type: 'MEMORY',
    title: 'MEMORY',
    instruction: 'Memorize the digits! They will hide shortly...',
    render: (arena) => {
      arena.innerHTML = `
        <div id="memory-flash" class="memory-box">${correctStr}</div>
        <div id="memory-choices" class="choices-grid hidden">
          ${choices.map(c => `<button class="choice-btn font-mono" data-val="${c}">${c}</button>`).join('')}
        </div>
      `;

      // Hide sequence after flash duration
      const flashDuration = diff === 'EASY' ? 2200 : 1700;
      setTimeout(() => {
        if (!state.isRoundActive) return;
        const flashEl = document.getElementById('memory-flash');
        const choicesEl = document.getElementById('memory-choices');
        if (flashEl && choicesEl) {
          flashEl.textContent = '• • • • •';
          flashEl.style.borderColor = 'var(--border-color)';
          choicesEl.classList.remove('hidden');
          DOM.challengeInstruction.textContent = 'Select the exact sequence you saw:';
        }
      }, flashDuration);

      arena.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          handleAnswer(btn.dataset.val === correctStr);
        });
      });
    }
  };
}

/**
 * 6. Sort: Tap numbers from smallest to largest
 */
function generateSort(diff) {
  const count = diff === 'EASY' ? 4 : diff === 'MEDIUM' ? 5 : 6;
  const numbers = [];
  while (numbers.length < count) {
    const num = randInt(5, 95);
    if (!numbers.includes(num)) numbers.push(num);
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  let currentIndex = 0;

  return {
    type: 'SORT',
    title: 'SORT',
    instruction: 'Tap the numbers in order from SMALLEST to LARGEST:',
    render: (arena) => {
      arena.innerHTML = `
        <div class="sort-container">
          <div class="sort-chips-grid">
            ${numbers.map(n => `<button class="sort-chip" data-num="${n}">${n}</button>`).join('')}
          </div>
          <div class="sort-progress">Next smallest: <span id="next-target-num">${sorted[0]}</span></div>
        </div>
      `;

      arena.querySelectorAll('.sort-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = parseInt(btn.dataset.num, 10);
          if (btn.classList.contains('locked')) return;

          if (val === sorted[currentIndex]) {
            btn.classList.add('locked');
            currentIndex++;
            playSound('tap');

            if (currentIndex >= sorted.length) {
              handleAnswer(true);
            } else {
              const nextTarget = document.getElementById('next-target-num');
              if (nextTarget) nextTarget.textContent = sorted[currentIndex];
            }
          } else {
            // Wrong number tapped!
            btn.style.borderColor = 'var(--color-danger)';
            handleAnswer(false);
          }
        });
      });
    }
  };
}

/**
 * 7. Target: Click all matching numbers
 */
function generateTarget(diff) {
  const rules = [
    { text: 'Tap all EVEN numbers', check: n => n % 2 === 0 },
    { text: 'Tap all numbers DIVISIBLE BY 3', check: n => n % 3 === 0 },
    { text: 'Tap all numbers GREATER THAN 40', check: n => n > 40 }
  ];
  const rule = rules[Math.floor(Math.random() * rules.length)];
  const total = diff === 'EASY' ? 6 : 8;

  const numbers = [];
  let matchingCount = 0;

  // Ensure at least 2 and at most 4 matching items
  while (numbers.length < total) {
    const candidate = randInt(12, 70);
    if (!numbers.includes(candidate)) {
      const isMatch = rule.check(candidate);
      if (isMatch && matchingCount >= 3) continue;
      numbers.push(candidate);
      if (isMatch) matchingCount++;
    }
  }

  // Ensure at least 2 match
  if (matchingCount < 2) {
    numbers[0] = rule.check === rules[0].check ? 24 : rule.check === rules[1].check ? 27 : 55;
    numbers[1] = rule.check === rules[0].check ? 38 : rule.check === rules[1].check ? 36 : 64;
  }

  shuffleArray(numbers);
  const correctTargetSet = new Set(numbers.filter(rule.check));
  const tappedSet = new Set();

  return {
    type: 'TARGET',
    title: 'TARGET',
    instruction: `${rule.text} (${correctTargetSet.size} total):`,
    render: (arena) => {
      arena.innerHTML = `
        <div class="symbol-grid" style="grid-template-columns: repeat(3, 1fr); max-width: 320px;">
          ${numbers.map(n => `<button class="choice-btn font-mono" data-val="${n}">${n}</button>`).join('')}
        </div>
      `;

      arena.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = parseInt(btn.dataset.val, 10);
          if (btn.classList.contains('selected')) return;

          if (correctTargetSet.has(val)) {
            btn.classList.add('selected');
            tappedSet.add(val);
            playSound('tap');

            if (tappedSet.size === correctTargetSet.size) {
              handleAnswer(true);
            }
          } else {
            btn.style.borderColor = 'var(--color-danger)';
            handleAnswer(false);
          }
        });
      });
    }
  };
}

/**
 * 8. Reaction: Fast impulse control
 */
function generateReaction(diff) {
  const triggerDelay = randInt(1000, 2600); // Trigger appears after 1.0 - 2.6s
  let hasTriggered = false;
  let triggerTimerId = null;

  return {
    type: 'REACTION',
    title: 'REACTION',
    instruction: 'Wait for GREEN, then TAP IMMEDIATELY!',
    render: (arena) => {
      arena.innerHTML = `
        <div class="reaction-container">
          <button id="reaction-target" class="reaction-btn">
            <span id="reaction-label" class="reaction-label">WAIT...</span>
            <span id="reaction-sub" class="reaction-sub">DO NOT TAP YET</span>
          </button>
        </div>
      `;

      const btn = document.getElementById('reaction-target');
      const label = document.getElementById('reaction-label');
      const sub = document.getElementById('reaction-sub');

      // Set trigger timeout
      triggerTimerId = setTimeout(() => {
        if (!state.isRoundActive) return;
        hasTriggered = true;
        if (btn && label && sub) {
          btn.classList.add('target-state');
          label.textContent = 'TAP NOW!';
          label.style.color = '#22c55e';
          sub.textContent = 'FAST!';
          playSound('tick');
        }
      }, triggerDelay);

      btn.addEventListener('click', () => {
        if (triggerTimerId) clearTimeout(triggerTimerId);

        if (!hasTriggered) {
          // Tapped prematurely!
          label.textContent = 'TOO EARLY!';
          btn.style.borderColor = 'var(--color-danger)';
          handleAnswer(false);
        } else {
          handleAnswer(true);
        }
      });
    }
  };
}

// ==========================================================================
// Challenge Dispatcher & Helpers
// ==========================================================================

function getNextChallenge(round) {
  const diff = getDifficulty(round);
  // Pick a challenge type, avoiding the immediately previous type if possible
  const typePool = [...CHALLENGE_TYPES];
  shuffleArray(typePool);
  const chosenType = typePool[0];

  switch (chosenType) {
    case 'MATH': return generateQuickMath(diff);
    case 'ODD_ONE_OUT': return generateOddOneOut(diff);
    case 'COUNT': return generateCount(diff);
    case 'PATTERN': return generatePattern(diff);
    case 'MEMORY': return generateMemory(diff);
    case 'SORT': return generateSort(diff);
    case 'TARGET': return generateTarget(diff);
    case 'REACTION': return generateReaction(diff);
    default: return generateQuickMath(diff);
  }
}

function generateDistractors(correctAnswer, count, minFloor = null) {
  const set = new Set([correctAnswer]);
  let offset = 1;
  while (set.size < count) {
    const delta = (Math.random() > 0.5 ? 1 : -1) * (offset + randInt(0, 3));
    const cand = correctAnswer + delta;
    if (minFloor !== null && cand < minFloor) {
      offset++;
      continue;
    }
    set.add(cand);
    offset++;
  }
  const arr = Array.from(set);
  shuffleArray(arr);
  return arr;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ==========================================================================
// Timer Core (High-Precision 10.0s Countdown with Color Urgency)
// ==========================================================================

function startRoundTimer() {
  state.roundStartTime = performance.now();
  state.timeRemaining = ROUND_TIME_LIMIT;
  updateTimerVisuals(ROUND_TIME_LIMIT);

  function step(now) {
    if (!state.isRoundActive) return;

    const elapsed = (now - state.roundStartTime) / 1000;
    const remaining = Math.max(0, ROUND_TIME_LIMIT - elapsed);
    state.timeRemaining = remaining;
    updateTimerVisuals(remaining);

    if (remaining <= 0) {
      handleTimeout();
    } else {
      state.timerAnimationId = requestAnimationFrame(step);
    }
  }

  state.timerAnimationId = requestAnimationFrame(step);
}

function stopRoundTimer() {
  if (state.timerAnimationId) {
    cancelAnimationFrame(state.timerAnimationId);
    state.timerAnimationId = null;
  }
}

function updateTimerVisuals(seconds) {
  DOM.timerReadout.textContent = `${seconds.toFixed(1)}s`;

  const percent = Math.max(0, Math.min(100, (seconds / ROUND_TIME_LIMIT) * 100));
  DOM.timerBar.style.width = `${percent}%`;

  // Color Urgency States
  DOM.timerBar.classList.remove('state-calm', 'state-warning', 'state-danger');
  DOM.timerReadout.classList.remove('warning', 'danger');

  if (seconds > 5.9) {
    DOM.timerBar.classList.add('state-calm');
  } else if (seconds > 2.9) {
    DOM.timerBar.classList.add('state-warning');
    DOM.timerReadout.classList.add('warning');
  } else {
    DOM.timerBar.classList.add('state-danger');
    DOM.timerReadout.classList.add('danger');
  }
}

// ==========================================================================
// Gameplay Mechanics & Scoring
// ==========================================================================

function startNewSession() {
  initAudioContext();
  state.currentRound = 0;
  state.score = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.roundsCorrect = 0;
  state.responseTimes = [];
  state.isTransitioning = false;

  showScreen('game');
  loadNextRound();
}

function loadNextRound() {
  state.currentRound++;
  if (state.currentRound > MAX_ROUNDS) {
    endSession();
    return;
  }

  state.isRoundActive = true;
  state.isTransitioning = false;
  DOM.feedbackBanner.classList.add('hidden');

  const diff = getDifficulty(state.currentRound);

  // Update HUD
  DOM.hudRound.textContent = `${state.currentRound} / ${MAX_ROUNDS}`;
  DOM.hudScore.textContent = state.score.toLocaleString();
  DOM.hudCombo.textContent = `🔥 ${state.combo}`;
  DOM.hudDiff.textContent = diff;
  DOM.hudDiff.className = `hud-badge ${diff.toLowerCase()}`;

  // Generate Challenge
  const challenge = getNextChallenge(state.currentRound);
  state.currentChallenge = challenge;

  DOM.challengeBadge.textContent = challenge.title;
  DOM.challengeInstruction.textContent = challenge.instruction;
  challenge.render(DOM.challengeArena);

  startRoundTimer();
}

function handleAnswer(isCorrect) {
  if (!state.isRoundActive || state.isTransitioning) return;

  state.isRoundActive = false;
  state.isTransitioning = true;
  stopRoundTimer();

  const responseTime = Math.max(0.1, ROUND_TIME_LIMIT - state.timeRemaining);
  state.responseTimes.push(responseTime);

  // Disable buttons in arena to prevent multiple taps
  DOM.challengeArena.querySelectorAll('button').forEach(b => b.disabled = true);

  if (isCorrect) {
    playSound('correct');
    state.roundsCorrect++;
    state.combo++;
    if (state.combo > state.maxCombo) state.maxCombo = state.combo;

    // Calculate score
    const diff = getDifficulty(state.currentRound);
    const diffMult = diff === 'EASY' ? 1.0 : diff === 'MEDIUM' ? 1.4 : 1.8;
    const comboMult = 1 + (state.combo - 1) * 0.15;
    const speedBonus = Math.round(state.timeRemaining * 25);
    const pointsEarned = Math.round((100 + speedBonus) * diffMult * comboMult);

    state.score += pointsEarned;
    DOM.hudScore.textContent = state.score.toLocaleString();
    DOM.hudCombo.textContent = `🔥 ${state.combo}`;

    showFeedback(true, `+${pointsEarned} PTS`);
  } else {
    playSound('wrong');
    state.combo = 0;
    DOM.hudCombo.textContent = `🔥 0`;
    showFeedback(false, 'COMBO BROKEN');
  }

  // Rapid transition to next round (650ms)
  setTimeout(() => {
    loadNextRound();
  }, 750);
}

function handleTimeout() {
  if (!state.isRoundActive || state.isTransitioning) return;

  state.isRoundActive = false;
  state.isTransitioning = true;
  stopRoundTimer();

  state.responseTimes.push(ROUND_TIME_LIMIT);
  state.combo = 0;
  DOM.hudCombo.textContent = `🔥 0`;
  playSound('wrong');

  // Disable arena buttons
  DOM.challengeArena.querySelectorAll('button').forEach(b => b.disabled = true);

  showFeedback(false, "TIME'S UP");

  setTimeout(() => {
    loadNextRound();
  }, 850);
}

function showFeedback(isCorrect, pointsText) {
  DOM.feedbackBanner.classList.remove('hidden', 'correct', 'wrong');
  if (isCorrect) {
    DOM.feedbackBanner.classList.add('correct');
    DOM.feedbackIcon.textContent = '✓';
    DOM.feedbackText.textContent = 'CORRECT!';
    DOM.feedbackPoints.textContent = pointsText;
  } else {
    DOM.feedbackBanner.classList.add('wrong');
    DOM.feedbackIcon.textContent = '✕';
    DOM.feedbackText.textContent = pointsText === "TIME'S UP" ? "TIME'S UP!" : 'INCORRECT!';
    DOM.feedbackPoints.textContent = '+0 PTS';
  }
}

// ==========================================================================
// Session Complete & Results
// ==========================================================================

function endSession() {
  state.isRoundActive = false;
  stopRoundTimer();
  playSound('fanfare');

  const accuracy = Math.round((state.roundsCorrect / MAX_ROUNDS) * 100);
  const avgTime = state.responseTimes.length > 0
    ? (state.responseTimes.reduce((a, b) => a + b, 0) / state.responseTimes.length).toFixed(1)
    : '0.0';

  // Check and save High Score in localStorage
  let isNewRecord = false;
  if (state.score > state.bestScore) {
    state.bestScore = state.score;
    isNewRecord = true;
    localStorage.setItem('ten_best_score', state.bestScore.toString());
  }

  // Populate Results UI
  DOM.resultsFinalScore.textContent = state.score.toLocaleString();
  DOM.resAccuracy.textContent = `${accuracy}%`;
  DOM.resBestCombo.textContent = `🔥 ${state.maxCombo}`;
  DOM.resAvgTime.textContent = `${avgTime}s`;
  DOM.resAlltimeBest.textContent = state.bestScore.toLocaleString();

  if (isNewRecord && state.score > 0) {
    DOM.resultsRecordBadge.classList.remove('hidden');
  } else {
    DOM.resultsRecordBadge.classList.add('hidden');
  }

  // Performance Critique
  if (state.score >= 1800) {
    DOM.resultsMedal.textContent = '👑';
    DOM.resultsCritique.textContent = 'Mental powerhouse! Master reflexes.';
  } else if (state.score >= 1400) {
    DOM.resultsMedal.textContent = '⚡';
    DOM.resultsCritique.textContent = 'Sharp reflexes and razor focus.';
  } else if (state.score >= 900) {
    DOM.resultsMedal.textContent = '🎯';
    DOM.resultsCritique.textContent = 'Solid performance! Keep practicing.';
  } else {
    DOM.resultsMedal.textContent = '⏱️';
    DOM.resultsCritique.textContent = 'Speed up next time! Beat the clock.';
  }

  showScreen('results');
}

// ==========================================================================
// Screen Management & Modals
// ==========================================================================

function showScreen(screenName) {
  state.activeScreen = screenName;
  DOM.screenStart.classList.remove('active');
  DOM.screenGame.classList.remove('active');
  DOM.screenResults.classList.remove('active');

  if (screenName === 'start') {
    DOM.screenStart.classList.add('active');
    DOM.startBestScore.textContent = `${state.bestScore.toLocaleString()} PTS`;
  } else if (screenName === 'game') {
    DOM.screenGame.classList.add('active');
  } else if (screenName === 'results') {
    DOM.screenResults.classList.add('active');
  }
}

function loadSavedData() {
  try {
    const savedBest = localStorage.getItem('ten_best_score');
    if (savedBest) state.bestScore = parseInt(savedBest, 10) || 0;

    const savedSound = localStorage.getItem('ten_sound');
    state.soundEnabled = savedSound !== 'false';
    updateSoundUI();
  } catch (e) {
    console.debug('Error reading localStorage', e);
  }
  DOM.startBestScore.textContent = `${state.bestScore.toLocaleString()} PTS`;
}

function updateSoundUI() {
  if (state.soundEnabled) {
    DOM.soundIconOn.classList.remove('hidden');
    DOM.soundIconOff.classList.add('hidden');
    DOM.btnSound.setAttribute('title', 'Sound: Enabled');
  } else {
    DOM.soundIconOn.classList.add('hidden');
    DOM.soundIconOff.classList.remove('hidden');
    DOM.btnSound.setAttribute('title', 'Sound: Muted');
  }
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  localStorage.setItem('ten_sound', state.soundEnabled ? 'true' : 'false');
  updateSoundUI();
  if (state.soundEnabled) playSound('tap');
}

function setupEventHandlers() {
  // Start & Play Again
  DOM.btnStartGame.addEventListener('click', startNewSession);
  DOM.btnPlayAgain.addEventListener('click', startNewSession);

  // Sound toggle
  DOM.btnSound.addEventListener('click', toggleSound);

  // How to Play Modal
  DOM.btnHelp.addEventListener('click', () => DOM.modalHelp.classList.remove('hidden'));
  DOM.btnStartHelp.addEventListener('click', () => DOM.modalHelp.classList.remove('hidden'));

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => DOM.modalHelp.classList.add('hidden'));
  });

  DOM.modalHelp.addEventListener('click', (e) => {
    if (e.target === DOM.modalHelp) DOM.modalHelp.classList.add('hidden');
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') DOM.modalHelp.classList.add('hidden');
  });
}

// ==========================================================================
// Initialization Entry Point
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadSavedData();
  setupEventHandlers();
  showScreen('start');
});
