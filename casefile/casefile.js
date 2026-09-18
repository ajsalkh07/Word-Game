/**
 * ==========================================================================
 * CASEFILE - Detective Investigation Engine
 * Part of SYNAPSE Mini-Game Platform
 * 
 * Architecture:
 *  - Deterministic case database (Case #001: The Missing Trophy)
 *  - Interactive crime scene inspection
 *  - Suspect interrogation cross-examination dialogues
 *  - Categorized evidence board & chronological timeline
 *  - Persistent case notes with localStorage
 *  - Multi-step accusation system with forensic validation
 *  - Native Web Audio API sound synthesizer
 * ==========================================================================
 */

// --- Case Database ---
const CASE_DATA = {
  id: 'case001',
  caseNumber: 'CASE #001',
  title: 'THE MISSING TROPHY',
  location: 'East Wing Trophy Hall — Room 104',
  incidentWindow: '4:10 PM – 4:25 PM',
  
  // Culprit configuration
  culpritId: 'suspect-rj',
  validEvidenceIds: ['ev-04', 'ev-05', 'ev-06', 'ev-07'],

  // Evidence Collection (8 Clues)
  evidence: [
    {
      id: 'ev-01',
      objectId: 'obj-cabinet',
      title: 'Display Cabinet Lock Inspection',
      category: 'PHYSICAL',
      icon: '🏆',
      shortDesc: 'Cabinet glass is intact. Lock was opened using a genuine key; blue lubricant residue was detected near the keyhole.',
      fullDesc: 'Forensic inspection of the display case confirms no forced breakage. The tempered glass is entirely undamaged. The tumblers were unlocked smoothly using a genuine cabinet key. A tiny smear of industrial blue lithium grease was lifted from the keyhole collar.',
      significance: 'The thief did not break the glass. They obtained the actual cabinet key and had grease on their hands or tools.'
    },
    {
      id: 'ev-02',
      objectId: 'obj-door',
      title: 'Digital Door Access Log',
      category: 'DIGITAL',
      icon: '🚪',
      shortDesc: 'Room door was locked electronically at 4:10 PM by Alex. No badge swipe occurred during the theft window.',
      fullDesc: 'The electronic lock audit trail reveals Alex Morgan swiped in at 4:05 PM and the door contact sensor closed at 4:10 PM. No further digital card swipes were registered between 4:10 PM and 4:25 PM.',
      significance: 'The intruder did not use a digital keycard to enter after 4:10 PM. They either bypassed the electronic latch or used physical tools.'
    },
    {
      id: 'ev-03',
      objectId: 'obj-window',
      title: 'Casement Window Latch',
      category: 'PHYSICAL',
      icon: '🪟',
      shortDesc: 'Window is locked from the inside with an undisturbed thick layer of dust on the sill.',
      fullDesc: 'High casement window overlooking the campus courtyard. The brass turn-latch is fully locked from the interior. The exterior stone ledge and interior sill have a heavy, undisturbed coat of dust.',
      significance: 'Entry and exit through the window is physically impossible. The culprit operated strictly from the interior corridor.'
    },
    {
      id: 'ev-04',
      objectId: 'obj-camera',
      title: 'Hallway Surveillance Footage',
      category: 'DIGITAL',
      icon: '📹',
      shortDesc: 'Camera captures Ryan entering with a toolbox at 4:12 PM, power blackout at 4:17 PM, and Ryan departing with a heavier box at 4:20 PM.',
      fullDesc: 'Surveillance tape at 4:12 PM captures Ryan Joseph walking down the restricted corridor carrying a large blue steel maintenance toolbox. At 4:17 PM, the camera feed flickers out for exactly 2 minutes due to a localized power cut. At 4:20 PM, footage resumes, showing Ryan exiting the wing carrying the toolbox with noticeable physical strain.',
      significance: 'Direct visual proof of Ryan near the room during the blackout, leaving with a significantly heavier toolbox.'
    },
    {
      id: 'ev-05',
      objectId: 'obj-desk',
      title: 'Pried Desk Drawer & Key',
      category: 'PHYSICAL',
      icon: '🗄️',
      shortDesc: 'The administrator desk drawer was pried open with a flathead tool; grease on the handle matches maintenance toolboxes.',
      fullDesc: 'The wooden administrator desk drawer, where the spare cabinet key is stored in a velvet box, was forced open. Indentation marks match a 10mm flathead screwdriver. Smudges of industrial blue grease on the brass handle match facilities maintenance gear.',
      significance: 'The thief forced the desk drawer to steal the cabinet key. Tool marks and grease tie directly to maintenance equipment.'
    },
    {
      id: 'ev-06',
      objectId: 'obj-floor',
      title: 'Waxed Floor Boot Tread',
      category: 'PHYSICAL',
      icon: '👣',
      shortDesc: 'Heavy work-boot tread impression in wet floor wax inside the room; matches facilities maintenance standard-issue boots.',
      fullDesc: 'Custodial staff had waxed the perimeter of the room earlier in the afternoon. A distinct partial boot tread impression was pressed into the tacky wax right in front of the trophy cabinet. The chevron sole pattern matches size 10 facilities maintenance safety boots.',
      significance: 'Proves conclusively that someone wearing campus maintenance boots walked directly in front of the trophy cabinet.'
    },
    {
      id: 'ev-07',
      objectId: 'obj-breaker',
      title: 'Circuit Breaker Inspection',
      category: 'TIMELINE',
      icon: '⚡',
      shortDesc: 'The camera circuit breaker was manually switched off using a facilities service key at 4:17 PM, not tripped by an electrical surge.',
      fullDesc: 'Inspection of the electrical distribution box in the utility alcove shows the breaker controlling Room 104 camera circuits was manually toggled OFF at 4:17 PM and back ON at 4:19 PM. The metal box door was unlocked with a facilities service triangle key.',
      significance: 'Refutes Ryan\'s alibi of an accidental power trip. The blackout was calculated and manually executed with maintenance keys.'
    },
    {
      id: 'ev-08',
      objectId: 'obj-trash',
      title: 'Discarded Maintenance Work Order',
      category: 'WITNESS',
      icon: '🗑️',
      shortDesc: 'A crumpled work order for corridor light replacement was scheduled for tomorrow morning, not today.',
      fullDesc: 'Retrieved from the office wastebasket. A facilities dispatch order for "Inspect flickering emergency lamp - East Corridor" stamped with date: "TOMORROW, 09:00 AM".',
      significance: 'Ryan had no legitimate authorized assignment to be working on the corridor lighting today. It was a pretext to be in the wing.'
    }
  ],

  // Suspects (4 Persons of Interest)
  suspects: [
    {
      id: 'suspect-am',
      name: 'Alex Morgan',
      role: 'Event Coordinator',
      avatar: 'AM',
      statement: 'I set up the brochures and locked the trophy room at 4:10 PM before heading to the auditorium sound booth.',
      dialogue: [
        {
          q: 'Did you verify the trophy was in the cabinet before you left?',
          a: 'Yes, absolutely. The championship trophy was right in the center of the illuminated cabinet when I closed the display room door at 4:10 PM.'
        },
        {
          q: 'Who else has keys to that room?',
          a: 'I locked the heavy door with my master keycard. Only department heads have electronic cards, but facilities staff have physical master override keys for emergencies.'
        },
        {
          q: 'Where did you go after locking up?',
          a: 'I walked straight down to the auditorium sound booth. Three stage technicians were setting up audio and can verify I arrived around 4:13 PM and remained there.'
        }
      ]
    },
    {
      id: 'suspect-mt',
      name: 'Maya Thomas',
      role: 'Team Captain',
      avatar: 'MT',
      statement: 'I was practicing free-throws in the athletic complex gym from 4:00 PM to 4:30 PM.',
      dialogue: [
        {
          q: 'Did you step out of the gym during practice?',
          a: 'Only between 4:14 and 4:20 PM to take a private phone call from our assistant coach. I walked onto the outdoor track bleachers right beside the gym.'
        },
        {
          q: 'Were you upset about the trophy inscription earlier today?',
          a: 'I complained to the committee because they misspelled our team\'s founding year on the base. But why would I steal the trophy we worked four years to win?'
        },
        {
          q: 'Could you have run to the trophy hall during your phone call?',
          a: 'The athletic complex is on the opposite side of campus. It\'s an 8 to 10-minute sprint just one-way. There is no way I could make that round trip in 6 minutes.'
        }
      ]
    },
    {
      id: 'suspect-rj',
      name: 'Ryan Joseph',
      role: 'Maintenance Assistant',
      avatar: 'RJ',
      statement: 'I was replacing an emergency light bulb in the east corridor near the trophy room at 4:15 PM and never entered the room.',
      dialogue: [
        {
          q: 'Why did you bring a heavy steel toolbox just to change a light bulb?',
          a: 'Uh, standard facilities protocol. We always carry the complete kit with pliers, screwdrivers, and socket wrenches in case a fixture bracket is rusted.'
        },
        {
          q: 'What caused the power blackout at 4:17 PM?',
          a: 'The old ballast shorted out when I took the cover off! It tripped the breaker box in the utility closet, so I had to reset it. It was just an accidental surge, honest.'
        },
        {
          q: 'Did you step inside the trophy display room at any point?',
          a: 'Never! I swear on my job, I stayed entirely out in the corridor working on the ceiling fixture. I didn\'t touch that room door or anything inside.'
        }
      ]
    },
    {
      id: 'suspect-dr',
      name: 'Daniel Roy',
      role: 'Event Photographer',
      avatar: 'DR',
      statement: 'I was taking venue wide-shots from the second-floor balcony between 4:05 PM and 4:25 PM.',
      dialogue: [
        {
          q: 'Why is there a 10-minute gap in your camera photo timestamps between 4:10 and 4:20 PM?',
          a: 'My primary 70-200mm lens jammed on the tripod collar. I went into the second-floor media booth to blow dust off the sensor and swap lenses.'
        },
        {
          q: 'Did you see anyone moving in the east corridor from the balcony?',
          a: 'Around 4:12 PM, I looked down toward the wing and saw the maintenance guy carrying his toolbox toward Room 104. Right after, the corridor lights went dark.'
        },
        {
          q: 'Do you have physical access to the trophy display cabinet?',
          a: 'No, my press pass only opens public media lounges and stage wings. I have zero access to administrative rooms or cabinet keys.'
        }
      ]
    }
  ],

  // Chronological Timeline (5 Reconstructed Events)
  timeline: [
    {
      id: 'tl-01',
      time: '3:50 PM',
      source: 'ATHLETIC DIRECTOR LOG',
      title: 'Trophy Confirmed in Cabinet',
      desc: 'Director of Athletics visually inspects and locks the solid-gold trophy inside the illuminated display case.'
    },
    {
      id: 'tl-02',
      time: '4:05 PM – 4:10 PM',
      source: 'KEYCARD ACCESS LOG',
      title: 'Alex Morgan Prepares Programs',
      desc: 'Alex unlocks Room 104 with master keycard to drop off ceremony brochures. Leaves and securely locks door at 4:10 PM.'
    },
    {
      id: 'tl-03',
      time: '4:12 PM',
      source: 'SURVEILLANCE CAM #3',
      title: 'Ryan Joseph Enters Corridor',
      desc: 'Maintenance Assistant Ryan Joseph enters restricted east wing corridor carrying a large blue steel toolbox.'
    },
    {
      id: 'tl-04',
      time: '4:17 PM – 4:19 PM',
      source: 'ELECTRICAL PANEL AUDIT',
      title: 'Deliberate Power Interruption',
      desc: 'Circuit breaker for Room 104 cameras manually switched OFF using a maintenance service key. Corridor plunged into darkness.'
    },
    {
      id: 'tl-05',
      time: '4:20 PM – 4:25 PM',
      source: 'SURVEILLANCE & DISCOVERY',
      title: 'Theft Completed & Discovery',
      desc: 'Ryan Joseph exits corridor carrying a noticeably heavier toolbox. At 4:25 PM, staff discover cabinet unlocked and trophy missing.'
    }
  ],

  // Case Solution & Verdict Dossier
  solution: {
    culpritName: 'Ryan Joseph',
    culpritRole: 'Maintenance Assistant',
    motive: 'Financial gain. Ryan intended to dismantle and fence the antique solid-gold trophy to an underground antiquities collector.',
    method: 'Fabricated an unauthorized bulb replacement to access the restricted corridor. Forced open the desk drawer with a flathead screwdriver to steal the spare cabinet key. Manually killed the breaker at 4:17 PM to blind surveillance cameras, unlocked the cabinet, concealed the trophy in his toolbox, and walked out.',
    contradiction: 'Ryan claimed under questioning that he "never stepped inside the trophy room" and that the power cut was an "accidental bulb blowout". However, forensic evidence thoroughly disproves his statement:\n• Size 10 facilities boot tread in the floor wax proves he walked directly up to the cabinet.\n• Blue lithium grease from his toolbox was found on both the pried drawer and the cabinet lock.\n• The electrical box inspection proved the breaker was manually flipped with his service key, not tripped by a blown bulb.'
  }
};

// ==========================================================================
// Application State
// ==========================================================================
const state = {
  activeScreen: 'briefing', // 'briefing' | 'investigation' | 'results'
  activeTab: 'scene',       // 'scene' | 'suspects' | 'evidence' | 'timeline' | 'notes'
  
  discoveredEvidence: new Set(),
  questionedSuspects: new Set(),
  unlockedTimeline: new Set(),
  
  selectedAccusedSuspect: null,
  selectedAccusedEvidence: null,
  
  soundEnabled: true
};

// Web Audio Context
let audioCtx = null;

// ==========================================================================
// DOM Cache
// ==========================================================================
const DOM = {
  // Screens
  screenBriefing: document.getElementById('screen-briefing'),
  screenInvestigation: document.getElementById('screen-investigation'),
  screenResults: document.getElementById('screen-results'),
  
  // Navigation & Buttons
  btnStartInvestigation: document.getElementById('btn-start-investigation'),
  btnOpenAccusation: document.getElementById('btn-open-accusation'),
  btnCaseReset: document.getElementById('btn-case-reset'),
  btnSound: document.getElementById('btn-sound'),
  soundIconOn: document.getElementById('sound-icon-on'),
  soundIconOff: document.getElementById('sound-icon-off'),
  bgMusic: document.getElementById('bg-music'),
  
  // HUD Counters
  hudEvidenceCount: document.getElementById('hud-evidence-count'),
  hudSuspectsCount: document.getElementById('hud-suspects-count'),
  hudTimelineCount: document.getElementById('hud-timeline-count'),
  
  // Tabs
  dashTabs: document.querySelectorAll('.dash-tab'),
  tabPanes: document.querySelectorAll('.tab-pane'),
  
  // Containers
  suspectsGrid: document.getElementById('suspects-grid'),
  evidenceGrid: document.getElementById('evidence-grid'),
  timelineEventsList: document.getElementById('timeline-events-list'),
  evidenceFilterBtns: document.querySelectorAll('.filter-btn'),
  
  // Notes
  caseNotesInput: document.getElementById('case-notes-input'),
  btnSaveNotes: document.getElementById('btn-save-notes'),
  btnInsertTimestamp: document.getElementById('btn-insert-timestamp'),
  btnClearNotes: document.getElementById('btn-clear-notes'),
  notesStatus: document.getElementById('notes-status'),
  
  // Modals
  modalEvidence: document.getElementById('modal-evidence'),
  modalEvId: document.getElementById('modal-ev-id'),
  modalEvCategory: document.getElementById('modal-ev-category'),
  modalEvIcon: document.getElementById('modal-ev-icon'),
  evModalTitle: document.getElementById('ev-modal-title'),
  evModalDesc: document.getElementById('ev-modal-desc'),
  evModalSignificance: document.getElementById('ev-modal-significance'),
  
  modalSuspect: document.getElementById('modal-suspect'),
  suspectModalAvatar: document.getElementById('suspect-modal-avatar'),
  suspectModalName: document.getElementById('suspect-modal-name'),
  suspectModalRole: document.getElementById('suspect-modal-role'),
  suspectModalStatement: document.getElementById('suspect-modal-statement'),
  suspectModalQa: document.getElementById('suspect-modal-qa'),
  
  modalAccusation: document.getElementById('modal-accusation'),
  accusationSuspectsGrid: document.getElementById('accusation-suspects-grid'),
  accusationEvidenceList: document.getElementById('accusation-evidence-list'),
  btnSubmitAccusation: document.getElementById('btn-submit-accusation'),
  
  // Verdict Screen Elements
  verdictSuccess: document.getElementById('verdict-success'),
  verdictFailure: document.getElementById('verdict-failure'),
  solvedRating: document.getElementById('solved-rating'),
  finalEvCount: document.getElementById('final-ev-count'),
  finalSuspectsCount: document.getElementById('final-suspects-count'),
  finalTimelineCount: document.getElementById('final-timeline-count'),
  btnReplayCase: document.getElementById('btn-replay-case'),
  btnReviewEvidence: document.getElementById('btn-review-evidence'),
  btnTryAgain: document.getElementById('btn-try-again'),
  
  // Toast Container
  toastContainer: document.getElementById('toast-container')
};

// ==========================================================================
// Web Audio Synthesizer
// ==========================================================================
function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
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
      case 'click': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case 'clue': {
        // Detective discovery chime
        [587.33, 880.0].forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.08, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.18);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.2);
        });
        break;
      }

      case 'solved': {
        // Grand victory cadence
        [392.0, 523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.09);
          gain.gain.setValueAtTime(0.12, now + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 0.4);
        });
        break;
      }

      case 'error': {
        // Deep low suspense tone
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.setValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
    }
  } catch (e) {
    console.debug('Audio playback ignored:', e);
  }
}

// ==========================================================================
// Screen & Tab Switching
// ==========================================================================
function showScreen(screenId) {
  state.activeScreen = screenId;
  DOM.screenBriefing.classList.remove('active');
  DOM.screenInvestigation.classList.remove('active');
  DOM.screenResults.classList.remove('active');

  if (screenId === 'briefing') DOM.screenBriefing.classList.add('active');
  if (screenId === 'investigation') DOM.screenInvestigation.classList.add('active');
  if (screenId === 'results') DOM.screenResults.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchTab(tabId) {
  state.activeTab = tabId;
  playSound('click');

  DOM.dashTabs.forEach(tab => {
    const isTarget = tab.dataset.tab === tabId;
    tab.classList.toggle('active', isTarget);
    tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
  });

  DOM.tabPanes.forEach(pane => {
    pane.classList.toggle('active', pane.id === `tab-${tabId}`);
  });
}

// ==========================================================================
// Crime Scene Inspection & Evidence Management
// ==========================================================================
function setupCrimeScene() {
  document.querySelectorAll('.scene-object-card').forEach(card => {
    card.addEventListener('click', () => {
      const evId = card.dataset.evidenceId;
      inspectEvidence(evId);
    });
  });
}

function inspectEvidence(evId) {
  const ev = CASE_DATA.evidence.find(item => item.id === evId);
  if (!ev) return;

  initAudioContext();

  const isFirstDiscovery = !state.discoveredEvidence.has(evId);
  if (isFirstDiscovery) {
    state.discoveredEvidence.add(evId);
    playSound('clue');
    showToast(`🔍 Evidence Discovered: ${ev.title}`);
    
    // Check if discovering this clue unlocks timeline events
    checkTimelineUnlocks();
    updateHUD();
    renderEvidenceBoard();
    
    // Update Scene Object Card style
    const objCard = document.querySelector(`[data-evidence-id="${evId}"]`);
    if (objCard) {
      objCard.classList.add('inspected');
      const statusEl = document.getElementById(`status-${evId}`);
      if (statusEl) statusEl.textContent = 'Examined';
    }
  } else {
    playSound('click');
  }

  // Populate and show evidence modal
  DOM.modalEvId.textContent = ev.id.toUpperCase();
  DOM.modalEvCategory.textContent = ev.category;
  DOM.modalEvCategory.className = `category-chip ${ev.category.toLowerCase()}`;
  DOM.modalEvIcon.textContent = ev.icon;
  DOM.evModalTitle.textContent = ev.title;
  DOM.evModalDesc.textContent = ev.fullDesc;
  DOM.evModalSignificance.textContent = ev.significance;

  openModal(DOM.modalEvidence);
}

function renderEvidenceBoard(filter = 'all') {
  DOM.evidenceGrid.innerHTML = '';

  if (state.discoveredEvidence.size === 0) {
    DOM.evidenceGrid.innerHTML = `
      <div class="evidence-empty-msg">
        <p>No clues discovered yet. Return to the <strong>CRIME SCENE</strong> tab and inspect objects in the trophy hall.</p>
      </div>
    `;
    return;
  }

  const collected = CASE_DATA.evidence.filter(ev => state.discoveredEvidence.has(ev.id));
  const filtered = filter === 'all' ? collected : collected.filter(ev => ev.category === filter);

  if (filtered.length === 0) {
    DOM.evidenceGrid.innerHTML = `
      <div class="evidence-empty-msg">
        <p>No clues matching the <strong>${filter}</strong> category yet.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(ev => {
    const card = document.createElement('div');
    card.className = 'clue-card';
    card.innerHTML = `
      <div class="clue-top">
        <span class="clue-stamp">${ev.id.toUpperCase()}</span>
        <span class="category-chip ${ev.category.toLowerCase()}">${ev.category}</span>
      </div>
      <h4 class="clue-title">${ev.title}</h4>
      <p class="clue-desc">${ev.shortDesc}</p>
      <div class="clue-footer">
        <span>Click to inspect</span>
        <span class="clue-link">VIEW EXHIBIT →</span>
      </div>
    `;
    card.addEventListener('click', () => inspectEvidence(ev.id));
    DOM.evidenceGrid.appendChild(card);
  });
}

// ==========================================================================
// Suspects Interrogation
// ==========================================================================
function renderSuspects() {
  DOM.suspectsGrid.innerHTML = '';

  CASE_DATA.suspects.forEach(suspect => {
    const card = document.createElement('div');
    card.className = 'suspect-card';
    const isQuestioned = state.questionedSuspects.has(suspect.id);

    card.innerHTML = `
      <div>
        <div class="suspect-header">
          <div class="suspect-avatar">${suspect.avatar}</div>
          <div class="suspect-info">
            <h4>${suspect.name}</h4>
            <span class="suspect-role-badge">${suspect.role}</span>
          </div>
        </div>
        <blockquote class="statement-quote">"${suspect.statement}"</blockquote>
      </div>
      <div class="suspect-card-footer">
        <span class="suspect-interrogation-status ${isQuestioned ? 'questioned' : ''}">
          ${isQuestioned ? '✓ Questioned' : 'Pending Interview'}
        </span>
        <button class="btn-question" data-suspect-id="${suspect.id}">QUESTION</button>
      </div>
    `;

    card.querySelector('.btn-question').addEventListener('click', () => {
      openSuspectModal(suspect.id);
    });

    DOM.suspectsGrid.appendChild(card);
  });
}

function openSuspectModal(suspectId) {
  const suspect = CASE_DATA.suspects.find(s => s.id === suspectId);
  if (!suspect) return;

  initAudioContext();
  playSound('click');

  if (!state.questionedSuspects.has(suspectId)) {
    state.questionedSuspects.add(suspectId);
    updateHUD();
    renderSuspects();
  }

  DOM.suspectModalAvatar.textContent = suspect.avatar;
  DOM.suspectModalName.textContent = suspect.name;
  DOM.suspectModalRole.textContent = suspect.role;
  DOM.suspectModalStatement.textContent = `"${suspect.statement}"`;

  DOM.suspectModalQa.innerHTML = '';
  suspect.dialogue.forEach(item => {
    const qaDiv = document.createElement('div');
    qaDiv.className = 'qa-item';
    qaDiv.innerHTML = `
      <div class="qa-question">Q: ${item.q}</div>
      <div class="qa-answer">A: "${item.a}"</div>
    `;
    DOM.suspectModalQa.appendChild(qaDiv);
  });

  openModal(DOM.modalSuspect);
}

// ==========================================================================
// Timeline Rebuilding
// ==========================================================================
function checkTimelineUnlocks() {
  // Always unlock events 1 and 2
  state.unlockedTimeline.add('tl-01');
  state.unlockedTimeline.add('tl-02');

  // If hallway camera discovered -> unlock event 3
  if (state.discoveredEvidence.has('ev-04')) {
    state.unlockedTimeline.add('tl-03');
  }

  // If breaker discovered -> unlock event 4
  if (state.discoveredEvidence.has('ev-07')) {
    state.unlockedTimeline.add('tl-04');
  }

  // If either camera or boot tread discovered -> unlock event 5
  if (state.discoveredEvidence.has('ev-04') || state.discoveredEvidence.has('ev-06')) {
    state.unlockedTimeline.add('tl-05');
  }

  renderTimeline();
}

function renderTimeline() {
  DOM.timelineEventsList.innerHTML = '';

  CASE_DATA.timeline.forEach(event => {
    const isUnlocked = state.unlockedTimeline.has(event.id);
    const item = document.createElement('div');
    item.className = 'timeline-item';

    if (isUnlocked) {
      item.innerHTML = `
        <div class="timeline-item-header">
          <span class="timeline-time">${event.time}</span>
          <span class="timeline-source">${event.source}</span>
        </div>
        <h4 class="timeline-item-title">${event.title}</h4>
        <p class="timeline-item-desc">${event.desc}</p>
      `;
    } else {
      item.innerHTML = `
        <div class="timeline-item-header">
          <span class="timeline-time">${event.time}</span>
          <span class="timeline-source">UNRESOLVED</span>
        </div>
        <h4 class="timeline-item-title" style="color: var(--text-faint);">[ Pending Clue Discovery ]</h4>
        <p class="timeline-item-desc" style="font-style: italic;">Continue investigating crime scene objects to unlock this chronological event.</p>
      `;
    }

    DOM.timelineEventsList.appendChild(item);
  });
}

// ==========================================================================
// Case Notes with LocalStorage
// ==========================================================================
function initNotes() {
  const savedNotes = localStorage.getItem('casefile_notes_case001');
  if (savedNotes) {
    DOM.caseNotesInput.value = savedNotes;
  }

  DOM.btnSaveNotes.addEventListener('click', () => {
    saveNotes();
  });

  DOM.btnInsertTimestamp.addEventListener('click', () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const tag = `[${timeStr}] `;
    const start = DOM.caseNotesInput.selectionStart;
    const end = DOM.caseNotesInput.selectionEnd;
    const text = DOM.caseNotesInput.value;
    DOM.caseNotesInput.value = text.substring(0, start) + tag + text.substring(end);
    DOM.caseNotesInput.focus();
    DOM.caseNotesInput.selectionStart = DOM.caseNotesInput.selectionEnd = start + tag.length;
  });

  DOM.btnClearNotes.addEventListener('click', () => {
    if (confirm('Clear all notes for this case?')) {
      DOM.caseNotesInput.value = '';
      saveNotes();
    }
  });

  DOM.caseNotesInput.addEventListener('input', () => {
    DOM.notesStatus.textContent = 'Unsaved changes...';
  });
}

function saveNotes() {
  const content = DOM.caseNotesInput.value;
  localStorage.setItem('casefile_notes_case001', content);
  DOM.notesStatus.textContent = 'All notes saved';
  playSound('click');
  showToast('📝 Notes saved successfully');
}

// ==========================================================================
// Accusation Modal & Submission Flow
// ==========================================================================
function openAccusationModal() {
  initAudioContext();
  playSound('click');

  state.selectedAccusedSuspect = null;
  state.selectedAccusedEvidence = null;
  DOM.btnSubmitAccusation.disabled = true;

  // Render suspects choices
  DOM.accusationSuspectsGrid.innerHTML = '';
  CASE_DATA.suspects.forEach(suspect => {
    const btn = document.createElement('button');
    btn.className = 'suspect-choice-btn';
    btn.dataset.id = suspect.id;
    btn.innerHTML = `
      <strong>${suspect.name}</strong>
      <span>${suspect.role}</span>
    `;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.suspect-choice-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.selectedAccusedSuspect = suspect.id;
      validateAccusationReady();
      playSound('click');
    });
    DOM.accusationSuspectsGrid.appendChild(btn);
  });

  // Render discovered evidence choices
  DOM.accusationEvidenceList.innerHTML = '';
  if (state.discoveredEvidence.size === 0) {
    DOM.accusationEvidenceList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.8rem; padding: 10px;">You must discover evidence before submitting an accusation.</p>';
  } else {
    CASE_DATA.evidence
      .filter(ev => state.discoveredEvidence.has(ev.id))
      .forEach(ev => {
        const item = document.createElement('button');
        item.className = 'evidence-choice-item';
        item.dataset.id = ev.id;
        item.textContent = `${ev.id.toUpperCase()}: ${ev.title}`;
        item.addEventListener('click', () => {
          document.querySelectorAll('.evidence-choice-item').forEach(b => b.classList.remove('selected'));
          item.classList.add('selected');
          state.selectedAccusedEvidence = ev.id;
          validateAccusationReady();
          playSound('click');
        });
        DOM.accusationEvidenceList.appendChild(item);
      });
  }

  openModal(DOM.modalAccusation);
}

function validateAccusationReady() {
  const isReady = (state.selectedAccusedSuspect !== null && state.selectedAccusedEvidence !== null);
  DOM.btnSubmitAccusation.disabled = !isReady;
}

function submitAccusation() {
  closeAllModals();

  const isCorrectCulprit = (state.selectedAccusedSuspect === CASE_DATA.culpritId);
  const isCorrectProof = CASE_DATA.validEvidenceIds.includes(state.selectedAccusedEvidence);

  showScreen('results');

  if (isCorrectCulprit && isCorrectProof) {
    // VICTORY: CASE SOLVED!
    playSound('solved');
    DOM.verdictSuccess.classList.remove('hidden');
    DOM.verdictFailure.classList.add('hidden');

    // Calculate rating based on completion
    const evCount = state.discoveredEvidence.size;
    const suspCount = state.questionedSuspects.size;
    const tlCount = state.unlockedTimeline.size;

    DOM.finalEvCount.textContent = `${evCount} / ${CASE_DATA.evidence.length}`;
    DOM.finalSuspectsCount.textContent = `${suspCount} / ${CASE_DATA.suspects.length}`;
    DOM.finalTimelineCount.textContent = `${tlCount} / ${CASE_DATA.timeline.length}`;

    if (evCount === 8 && suspCount === 4) {
      DOM.solvedRating.textContent = '★ PERFECT INVESTIGATION ★';
      DOM.solvedRating.style.color = '#eab308';
    } else {
      DOM.solvedRating.textContent = 'CASE SOLVED';
      DOM.solvedRating.style.color = '#22c55e';
    }

    // Save solved state
    localStorage.setItem('casefile_case001_solved', 'true');

  } else {
    // INCORRECT ACCUSATION
    playSound('error');
    DOM.verdictSuccess.classList.add('hidden');
    DOM.verdictFailure.classList.remove('hidden');

    const wrongMsg = document.getElementById('wrong-accusation-msg');
    if (!isCorrectCulprit) {
      wrongMsg.textContent = 'Your accusation targets an innocent person. Their alibi remains corroborated by witness statements and physical timestamps.';
    } else {
      wrongMsg.textContent = 'You identified the right suspect, but your chosen evidence does not conclusively contradict their alibi. Find the piece of proof that exposes their physical presence or intentional blackout.';
    }
  }
}

// ==========================================================================
// UI Helpers & HUD
// ==========================================================================
function updateHUD() {
  DOM.hudEvidenceCount.textContent = `${state.discoveredEvidence.size} / ${CASE_DATA.evidence.length}`;
  DOM.hudSuspectsCount.textContent = `${state.questionedSuspects.size} / ${CASE_DATA.suspects.length}`;
  DOM.hudTimelineCount.textContent = `${state.unlockedTimeline.size} / ${CASE_DATA.timeline.length}`;
}

function showToast(message, duration = 2600) {
  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.style.cssText = `
    background: #0e1524;
    color: #f8fafc;
    border: 1px solid #2f446d;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 700;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    margin-bottom: 8px;
    animation: fadeIn 0.2s ease-out;
  `;
  toast.textContent = message;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

function openModal(modalEl) {
  if (modalEl) modalEl.classList.remove('hidden');
}

function closeModal(modalEl) {
  if (modalEl) modalEl.classList.add('hidden');
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.add('hidden'));
}

function startBackgroundMusic() {
  if (!state.soundEnabled || !DOM.bgMusic) return;

  DOM.bgMusic.volume = 0.10;

  DOM.bgMusic.play().catch(() => {
    console.log('Music waiting for user interaction.');
  });
}

function stopBackgroundMusic() {
  if (DOM.bgMusic) {
    DOM.bgMusic.pause();
  }
}

// ==========================================================================
// Sound & Settings
// ==========================================================================
function initSound() {
  const saved = localStorage.getItem('casefile_sound');

  state.soundEnabled = (saved !== 'false');

  if (DOM.bgMusic) {
    DOM.bgMusic.volume = 0.10;
  }

  updateSoundUI();
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

// ==========================================================================
// Reset & Replay
// ==========================================================================
function resetCase() {
  if (confirm('Restart Case #001 investigation from the beginning? Your notes will be preserved.')) {
    state.discoveredEvidence.clear();
    state.questionedSuspects.clear();
    state.unlockedTimeline.clear();
    state.selectedAccusedSuspect = null;
    state.selectedAccusedEvidence = null;

    document.querySelectorAll('.scene-object-card').forEach(card => {
      card.classList.remove('inspected');
      const statusEl = card.querySelector('.object-status');
      if (statusEl) statusEl.textContent = 'Inspect';
    });

    checkTimelineUnlocks();
    updateHUD();
    renderEvidenceBoard();
    renderSuspects();

    showScreen('briefing');
    showToast('Case investigation reset.');
  }
}

// ==========================================================================
// Event Binding & Initialization
// ==========================================================================
function setupEventListeners() {
  // Sound toggle
DOM.btnSound.addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;

  localStorage.setItem(
    'casefile_sound',
    state.soundEnabled ? 'true' : 'false'
  );

  updateSoundUI();

  if (state.soundEnabled) {
    initAudioContext();
    playSound('click');
    startBackgroundMusic();
  } else {
    stopBackgroundMusic();
  }
});
  // Screen transitions
  DOM.btnStartInvestigation.addEventListener('click', () => {
    initAudioContext();
    playSound('click');
    startBackgroundMusic();
    showScreen('investigation');
  });

  // Tab switching
  DOM.dashTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });

  // Evidence filtering
  DOM.evidenceFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.evidenceFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderEvidenceBoard(btn.dataset.filter);
    });
  });

  // Accusation buttons
  DOM.btnOpenAccusation.addEventListener('click', openAccusationModal);
  DOM.btnSubmitAccusation.addEventListener('click', submitAccusation);

  // Results screen buttons
  DOM.btnReplayCase.addEventListener('click', () => {
    showScreen('briefing');
  });

  DOM.btnReviewEvidence.addEventListener('click', () => {
    showScreen('investigation');
    switchTab('evidence');
  });

  DOM.btnTryAgain.addEventListener('click', () => {
    showScreen('investigation');
    openAccusationModal();
  });

  // Reset case
  DOM.btnCaseReset.addEventListener('click', resetCase);

  // Close modals
  document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

// ==========================================================================
// Entry Point
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupCrimeScene();
  renderSuspects();
  checkTimelineUnlocks();
  renderEvidenceBoard();
  initNotes();
  initSound();
  setupEventListeners();
  updateHUD();
});
