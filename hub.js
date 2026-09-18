/**
 * ==========================================================================
 * SYNAPSE - Game Hub Controller
 * Modern Browser Gaming Platform
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadPlayerLiveStats();
  initCardInteractions();
});

// Theme Management
function initTheme() {
  const themeToggleBtn = document.getElementById('btn-theme-toggle');
  const moonIcon = document.getElementById('theme-icon-moon');
  const sunIcon = document.getElementById('theme-icon-sun');

  const savedTheme = localStorage.getItem('synapse_theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('synapse_theme', next);
      localStorage.setItem('lexiq_theme', next); // keep in sync with LexIQ
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      moonIcon?.classList.remove('hidden');
      sunIcon?.classList.add('hidden');
    } else {
      moonIcon?.classList.add('hidden');
      sunIcon?.classList.remove('hidden');
    }
  }
}

// Load Player Stats from LocalStorage and Enhance Game Cards
function loadPlayerLiveStats() {
  try {
    // 1. LexIQ Stats
    const lexiqSaved = localStorage.getItem('lexiq_stats');
    if (lexiqSaved) {
      const parsed = JSON.parse(lexiqSaved);
      if (parsed.played > 0) {
        const lexiqMeta = document.querySelector('.card-lexiq .meta-val');
        if (lexiqMeta) {
          lexiqMeta.textContent = `Streak: ${parsed.currentStreak} • Best: ${parsed.bestStreak}`;
        }
      }
    }

    // 2. TEN Stats
    const tenBest = localStorage.getItem('ten_best_score');
    if (tenBest && parseInt(tenBest, 10) > 0) {
      const tenMeta = document.querySelector('.card-ten .meta-val');
      if (tenMeta) {
        tenMeta.textContent = `Best: ${parseInt(tenBest, 10).toLocaleString()} PTS`;
      }
    }

    // 3. CASEFILE Stats
    const casefileSolved = localStorage.getItem('casefile_case001_solved');
    if (casefileSolved === 'true') {
      const casefileMeta = document.querySelector('.card-casefile .meta-val');
      if (casefileMeta) {
        casefileMeta.textContent = '★ SOLVED • Case #001';
        casefileMeta.style.color = '#eab308';
      }
    }
  } catch (e) {
    console.debug('Error reading local stats in hub:', e);
  }
}

// Subtle Sound / Click feedback using Web Audio API
function initCardInteractions() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  let hubAudioCtx = null;

  function playHubChime() {
    try {
      if (!hubAudioCtx && AudioContextClass) hubAudioCtx = new AudioContextClass();
      if (hubAudioCtx && hubAudioCtx.state === 'suspended') hubAudioCtx.resume();
      if (!hubAudioCtx) return;

      const now = hubAudioCtx.currentTime;
      const osc = hubAudioCtx.createOscillator();
      const gain = hubAudioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(hubAudioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      // ignore
    }
  }

  document.querySelectorAll('.btn-play-game, .cta-primary').forEach(btn => {
    btn.addEventListener('mouseenter', () => playHubChime());
  });
}
