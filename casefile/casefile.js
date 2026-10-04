/**
 * ==========================================================================
 * CASEFILE - Interactive Visual Detective Investigation Engine
 * Part of SYNAPSE Mini-Game Platform
 * ==========================================================================
 */

// ==========================================================================
// 1. Cases Database
// ==========================================================================
const CASES_DB = {
  case001: {
    id: 'case001',
    number: 'CASEFILE #01',
    title: 'THE LOCKED ROOM',
    subtitle: 'A crime scene with no obvious way in or out.',
    difficulty: 'MEDIUM',
    badgeClass: 'diff-medium',
    location: 'St. Jude Academy — Trophy Vault (Room 104)',
    timeWindow: '11:10 PM – 11:48 PM',
    thumbIcon: '🏛️',
    sceneTitle: 'TROPHY VAULT — ROOM 104',
    sceneDesc: 'Click highlighted objects across the room to gather forensic proof.',
    
    introBeats: [
      '11:48 PM.',
      'A silent alarm flashes across campus security.',
      'The 50-year-old Gold Championship Trophy is gone.',
      'One reinforced door — locked from the inside.',
      'No shattered glass. No broken windows.',
      'INVESTIGATION BEGINS.'
    ],
    voiceIntro: 'Eleven forty-eight P M. A silent alarm flashes across campus security. The championship trophy is gone from the locked vault. Investigation begins.',

    evidence: [
      {
        id: 'ev-c1-door',
        hotspotId: 'spot-c1-door',
        title: 'Reinforced Vault Door',
        category: 'DIGITAL',
        icon: '🚪',
        shortDesc: 'Electronic bolt locked on schedule at 11:10 PM.',
        keyFact: 'No digital badge swipe was registered during the theft.',
        timestamp: '11:10 PM'
      },
      {
        id: 'ev-c1-pedestal',
        hotspotId: 'spot-c1-pedestal',
        title: 'Glass Display Pedestal',
        category: 'PHYSICAL',
        icon: '🏆',
        shortDesc: 'Tempered glass is intact; lock was opened smoothly with a key.',
        keyFact: 'Blue lithium grease residue lifted from the keyhole collar.',
        timestamp: '11:18 PM'
      },
      {
        id: 'ev-c1-desk',
        hotspotId: 'spot-c1-desk',
        title: 'Pried Office Desk',
        category: 'PHYSICAL',
        icon: '🗄️',
        shortDesc: 'Admin drawer pried open with a 10mm flathead tool.',
        keyFact: 'Spare vault key stolen; blue grease smudges found on handle.',
        timestamp: '11:16 PM'
      },
      {
        id: 'ev-c1-window',
        hotspotId: 'spot-c1-window',
        title: 'High Casement Window',
        category: 'PHYSICAL',
        icon: '🪟',
        shortDesc: 'Window turn-latch firmly locked from inside.',
        keyFact: 'Undisturbed dust confirms entry or exit from window is impossible.',
        timestamp: '11:20 PM'
      },
      {
        id: 'ev-c1-cctv',
        hotspotId: 'spot-c1-cctv',
        title: 'Hallway CCTV Monitor',
        category: 'DIGITAL',
        icon: '🎥',
        shortDesc: 'Surveillance tape flickers out for exactly 2 minutes at 11:17 PM.',
        keyFact: 'Ryan enters with toolbox at 11:12 PM, departs straining under heavy weight at 11:19 PM.',
        timestamp: '11:17 PM'
      },
      {
        id: 'ev-c1-breaker',
        hotspotId: 'spot-c1-breaker',
        title: 'Circuit Breaker Panel',
        category: 'TIMELINE',
        icon: '⚡',
        shortDesc: 'Camera breaker was switched off manually, not tripped.',
        keyFact: 'Unlocked using a triangular maintenance service key.',
        timestamp: '11:17 PM'
      },
      {
        id: 'ev-c1-boot',
        hotspotId: 'spot-c1-boot',
        title: 'Waxed Floor Boot Tread',
        category: 'PHYSICAL',
        icon: '👣',
        shortDesc: 'Chevron boot impression pressed into tacky floor wax.',
        keyFact: 'Sole pattern matches size 10 facilities maintenance safety boots.',
        timestamp: '11:18 PM'
      },
      {
        id: 'ev-c1-bin',
        hotspotId: 'spot-c1-bin',
        title: 'Oily Utility Rag in Trash',
        category: 'PHYSICAL',
        icon: '🧤',
        shortDesc: 'Discarded rag found stuffed in the utility wastebasket.',
        keyFact: 'Saturated with the same industrial blue grease found on the lock.',
        timestamp: '11:19 PM'
      }
    ],

    suspects: [
      {
        id: 's-c1-ryan',
        name: 'Ryan Joseph',
        role: 'Maintenance Assistant',
        avatarText: 'RJ',
        avatarBg: '#d97706',
        alibi: '"I was down in the basement replacing lighting fixtures during the blackout."',
        suspicious: 'Possesses the triangular breaker key, wears size 10 boots, and uses blue toolbox grease.'
      },
      {
        id: 's-c1-alex',
        name: 'Alex Vance',
        role: 'Night Security Officer',
        avatarText: 'AV',
        avatarBg: '#2563eb',
        alibi: '"Patrolling the west campus perimeter gates between 11:00 and 11:30 PM."',
        suspicious: 'West gate electronic log verifies his badge, but his guard booth keys were left unattended.'
      },
      {
        id: 's-c1-elena',
        name: 'Elena Rostova',
        role: 'Lead Custodian',
        avatarText: 'ER',
        avatarBg: '#059669',
        alibi: '"Finished waxing the room floor at 10:45 PM, then locked up and went home."',
        suspicious: 'Wore smooth rubber-soled athletic sneakers, not heavy chevron work boots.'
      },
      {
        id: 's-c1-julian',
        name: 'Julian Croft',
        role: 'Student Athlete (Runner-Up)',
        avatarText: 'JC',
        avatarBg: '#7c3aed',
        alibi: '"Studying in the central campus library with teammates until midnight."',
        suspicious: 'Library turnstile card records and study group confirm he never left the library.'
      }
    ],

    timeline: [
      {
        id: 't-c1-1',
        time: '10:45 PM',
        title: 'Floor Waxing Completed',
        text: 'Elena finishes waxing Room 104 perimeter and exits building.',
        locked: false
      },
      {
        id: 't-c1-2',
        time: '11:10 PM',
        title: 'Scheduled Lockout',
        text: 'Vault door electronic bolt activates automatically.',
        locked: false
      },
      {
        id: 't-c1-3',
        time: '11:16 PM',
        title: 'Office Desk Forced',
        text: 'Drawer forced with flathead tool; spare key stolen.',
        locked: true,
        unlockClue: 'ev-c1-desk'
      },
      {
        id: 't-c1-4',
        time: '11:17 PM',
        title: 'Camera Blackout',
        text: 'Power breaker manually switched off using service triangle key.',
        locked: true,
        unlockClue: 'ev-c1-breaker'
      },
      {
        id: 't-c1-5',
        time: '11:19 PM',
        title: 'Departing with Load',
        text: 'CCTV captures Ryan exiting corridor carrying heavy toolbox.',
        locked: true,
        unlockClue: 'ev-c1-cctv'
      }
    ],

    solution: {
      culpritId: 's-c1-ryan',
      validEvidenceIds: ['ev-c1-cctv', 'ev-c1-breaker', 'ev-c1-boot', 'ev-c1-pedestal'],
      correctEvidenceId: 'ev-c1-cctv',
      correctTheoryId: 'th-c1-1',
      
      evidenceOptions: [
        { id: 'ev-c1-cctv', text: 'Hallway CCTV showing Ryan leaving with a heavily weighted toolbox after the blackout.' },
        { id: 'ev-c1-window', text: 'Undisturbed dust layer on the high casement window.' },
        { id: 'ev-c1-door', text: 'Electronic lock showing no badge swipe at 11:10 PM.' }
      ],
      theoryOptions: [
        { id: 'th-c1-1', text: 'Ryan used his maintenance key to cut camera power, pried the desk for the vault key, and smuggled the trophy out inside his heavy toolbox.' },
        { id: 'th-c1-2', text: 'An intruder entered from the courtyard window while security was patrolling the west gate.' },
        { id: 'th-c1-3', text: 'Elena took the trophy before waxing the floors and concealed it in a custodian locker.' }
      ],
      revealSteps: [
        'The camera circuit breaker was manually switched off using a maintenance service triangle key.',
        'Footprints pressed into the wet floor wax match size 10 maintenance chevron boots.',
        'Industrial blue lithium grease on the keyhole and pried drawer matches Ryan\'s toolkit.',
        'CCTV recorded Ryan entering with an ordinary toolbox and leaving straining under heavy metal weight right after power restored.'
      ]
    }
  },

  case002: {
    id: 'case002',
    number: 'CASEFILE #02',
    title: 'THE LAST TRAIN',
    subtitle: 'Three passengers. One missing wallet. One impossible timeline.',
    difficulty: 'HARD',
    badgeClass: 'diff-hard',
    location: 'Midnight Express — Carriage B Compartment',
    timeWindow: '12:40 AM – 1:15 AM',
    thumbIcon: '🚆',
    sceneTitle: 'MIDNIGHT EXPRESS — CARRIAGE B',
    sceneDesc: 'Examine the train compartment to uncover who stole Arthur\'s wallet.',

    introBeats: [
      '1:15 AM.',
      'The Midnight Express glides to a stop at the misty terminal.',
      'A passenger shouts: "My wallet and bearer bonds are gone!"',
      'Carriage B was sealed through the 7-minute mountain tunnel.',
      'Three passengers in the compartment.',
      'Three conflicting stories.',
      'INVESTIGATION BEGINS.'
    ],
    voiceIntro: 'One fifteen A M. The Midnight Express stops at the terminal. A valuable wallet has vanished from Carriage B during the mountain tunnel. Three passengers. One impossible timeline. Investigation begins.',

    evidence: [
      {
        id: 'ev-c2-seat',
        hotspotId: 'spot-c2-seat',
        title: 'Victim\'s Passenger Seat (12A)',
        category: 'PHYSICAL',
        icon: '💺',
        shortDesc: 'Deep leather seat where Arthur sat asleep.',
        keyFact: 'Arthur fell asleep at 12:40 AM with his wallet in his outer coat pocket.',
        timestamp: '12:40 AM'
      },
      {
        id: 'ev-c2-clock',
        hotspotId: 'spot-c2-clock',
        title: 'Compartment Analog Clock',
        category: 'TIMELINE',
        icon: '🕒',
        shortDesc: 'Analog train clock mounted on bulkhead.',
        keyFact: 'Train plunged into the dark mountain tunnel at 12:55 AM for 7 full minutes.',
        timestamp: '12:55 AM'
      },
      {
        id: 'ev-c2-bag',
        hotspotId: 'spot-c2-bag',
        title: 'Overhead Duffel Bag',
        category: 'PHYSICAL',
        icon: '👜',
        shortDesc: 'Victor\'s canvas duffel on the overhead luggage rack.',
        keyFact: 'Zipper pulled open 2 inches; only books and business paperwork inside.',
        timestamp: '1:00 AM'
      },
      {
        id: 'ev-c2-ticket',
        hotspotId: 'spot-c2-ticket',
        title: 'Watermarked Ticket Stub',
        category: 'PHYSICAL',
        icon: '🎫',
        shortDesc: 'First-class ticket stub lying near seat 14B.',
        keyFact: 'Spotted with fresh rain droplets blown in from the exterior window.',
        timestamp: '12:56 AM'
      },
      {
        id: 'ev-c2-coat',
        hotspotId: 'spot-c2-coat',
        title: 'Damp Trench Coat (Seat 14B)',
        category: 'PHYSICAL',
        icon: '🧥',
        shortDesc: 'Clara\'s trench coat hanging on the wall hook.',
        keyFact: 'Right sleeve cuff is stained with dark tunnel soot and wet rail grime.',
        timestamp: '1:02 AM'
      },
      {
        id: 'ev-c2-phone',
        hotspotId: 'spot-c2-phone',
        title: 'Dropped Smartphone',
        category: 'DIGITAL',
        icon: '📱',
        shortDesc: 'Smartphone lying face down beneath the center table.',
        keyFact: 'Unsent draft text written at 12:58 AM: "Got it. Meet me at terminal exit."',
        timestamp: '12:58 AM'
      },
      {
        id: 'ev-c2-window',
        hotspotId: 'spot-c2-window',
        title: 'Sliding Carriage Window',
        category: 'PHYSICAL',
        icon: '🪟',
        shortDesc: 'Window was slid open 3 inches during the storm.',
        keyFact: 'Explains the wet rain spray across the table and soot on Clara\'s sleeve.',
        timestamp: '12:56 AM'
      },
      {
        id: 'ev-c2-buzzer',
        hotspotId: 'spot-c2-buzzer',
        title: 'Emergency Porter Bell',
        category: 'DIGITAL',
        icon: '🔔',
        shortDesc: 'Carriage attendant bell log stamped at 1:05 AM.',
        keyFact: 'Leo buzzed the attendant from the exterior vestibule to complain about ventilation.',
        timestamp: '1:05 AM'
      }
    ],

    suspects: [
      {
        id: 's-c2-clara',
        name: 'Clara Bennett',
        role: 'Antiques Dealer',
        avatarText: 'CB',
        avatarBg: '#e11d48',
        alibi: '"I was reading my mystery novel under my reading lamp the entire trip without moving."',
        suspicious: 'Her dropped phone has the 12:58 AM draft "Got it", and her right cuff is smeared with window soot.'
      },
      {
        id: 's-c2-victor',
        name: 'Victor Sterling',
        role: 'Corporate Auditor',
        avatarText: 'VS',
        avatarBg: '#0284c7',
        alibi: '"I took a prescribed sleeping pill with tea at 12:30 AM and slept until arrival."',
        suspicious: 'His overhead duffel was unzipped, but his ticket and sleeping pill wrapper corroborate his sleep.'
      },
      {
        id: 's-c2-leo',
        name: 'Leo Thorne',
        role: 'Off-Duty Rail Porter',
        avatarText: 'LT',
        avatarBg: '#ca8a04',
        alibi: '"I spent the journey out in the drafty corridor vestibule smoking from 12:45 to 1:10 AM."',
        suspicious: 'Rang the attendant buzzer at 1:05 AM, but corridor witnesses confirm he never entered the compartment.'
      }
    ],

    timeline: [
      {
        id: 't-c2-1',
        time: '12:30 AM',
        title: 'Mountain Departure',
        text: 'Midnight Express departs last stop in heavy mountain rain.',
        locked: false
      },
      {
        id: 't-c2-2',
        time: '12:40 AM',
        title: 'Arthur Falls Asleep',
        text: 'Arthur dozes off in seat 12A with wallet tucked in coat.',
        locked: false
      },
      {
        id: 't-c2-3',
        time: '12:55 AM',
        title: 'Mountain Tunnel Plunge',
        text: 'Train enters 7-minute dark tunnel; overhead lights dim.',
        locked: true,
        unlockClue: 'ev-c2-clock'
      },
      {
        id: 't-c2-4',
        time: '12:58 AM',
        title: 'Accomplice Message',
        text: 'Draft text "Got it. Meet me at terminal exit" typed on phone.',
        locked: true,
        unlockClue: 'ev-c2-phone'
      },
      {
        id: 't-c2-5',
        time: '1:05 AM',
        title: 'Porter Call Ring',
        text: 'Leo rings conductor buzzer from corridor vestibule.',
        locked: true,
        unlockClue: 'ev-c2-buzzer'
      }
    ],

    solution: {
      culpritId: 's-c2-clara',
      validEvidenceIds: ['ev-c2-phone', 'ev-c2-coat', 'ev-c2-window'],
      correctEvidenceId: 'ev-c2-phone',
      correctTheoryId: 'th-c2-1',

      evidenceOptions: [
        { id: 'ev-c2-phone', text: 'Dropped phone beneath table with 12:58 AM draft: "Got it. Meet me at terminal exit."' },
        { id: 'ev-c2-bag', text: 'Victor\'s duffel bag unzipped on the overhead rack.' },
        { id: 'ev-c2-buzzer', text: 'Leo ringing the attendant bell from the corridor at 1:05 AM.' }
      ],
      theoryOptions: [
        { id: 'th-c2-1', text: 'Clara took advantage of Arthur\'s sleep and the tunnel darkness to slip the wallet from his coat, then drafted a text to her accomplice.' },
        { id: 'th-c2-2', text: 'Victor stole the wallet and hid it inside his overhead canvas luggage before feigning sleep.' },
        { id: 'th-c2-3', text: 'Leo broke into the carriage through the exterior sliding window while the train was traveling at full speed.' }
      ],
      revealSteps: [
        'The train entered the dark mountain tunnel at 12:55 AM, dimming the passenger compartment lights.',
        'Tunnel soot and rain stains on Clara\'s trench coat prove she opened the window during the storm.',
        'The dropped smartphone under the table belongs to Clara, timestamped with a 12:58 AM message: "Got it. Meet me at terminal exit."',
        'While Arthur slept and the carriage was pitch black, Clara slipped the wallet into her pocket.'
      ]
    }
  }
,

  case003: {
    id: 'case003',
    number: 'CASEFILE #03',
    title: 'THE MISSING NECKLACE',
    subtitle: 'A valuable necklace has disappeared from a hotel room. Three people had access.',
    difficulty: 'EASY ⭐',
    badgeClass: 'diff-easy',
    location: 'Grand Azure Hotel — Suite 402',
    timeWindow: '8:00 PM – 8:45 PM',
    thumbIcon: '💎',
    sceneTitle: 'GRAND AZURE HOTEL — SUITE 402',
    sceneDesc: 'Examine the hotel suite to uncover who took the sapphire necklace.',

    introBeats: [
      '8:45 PM.',
      'A necklace is missing.',
      'Three people entered the room.',
      'Only one of them took it.',
      'INVESTIGATION BEGINS.'
    ],
    voiceIntro: 'Eight forty-five P M. A necklace is missing from Suite 402. Three people entered the room. Only one of them took it. Investigation begins.',

    evidence: [
      {
        id: 'ev-c3-phone',
        hotspotId: 'spot-c3-phone',
        title: 'Smartphone Mirror Photo',
        category: 'DIGITAL',
        icon: '📱',
        shortDesc: 'Mirror photo taken by the victim at the vanity.',
        keyFact: 'Timestamped 8:20 PM; the necklace is clearly visible on the desk.',
        timestamp: '8:20 PM'
      },
      {
        id: 'ev-c3-door',
        hotspotId: 'spot-c3-door',
        title: 'Electronic Door Access Log',
        category: 'DIGITAL',
        icon: '🚪',
        shortDesc: 'Hotel keycard audit log for Suite 402.',
        keyFact: 'Mia entered 8:00 PM; Emma entered 8:05 PM, left 8:15 PM; Ryan entered 8:30 PM.',
        timestamp: '8:35 PM'
      },
      {
        id: 'ev-c3-tray',
        hotspotId: 'spot-c3-tray',
        title: 'Room-Service Receipt',
        category: 'TIMELINE',
        icon: '🍽️',
        shortDesc: 'Printed receipt left beside the food cloche.',
        keyFact: 'Receipt stamped 8:30 PM, signed and delivered by Ryan.',
        timestamp: '8:30 PM'
      },
      {
        id: 'ev-c3-cart',
        hotspotId: 'spot-c3-cart',
        title: 'Housekeeping Cart',
        category: 'PHYSICAL',
        icon: '🧹',
        shortDesc: 'Linen cleaning cart parked outside Suite 402.',
        keyFact: 'A small blue thread matching the necklace is caught on the cart.',
        timestamp: '8:02 PM'
      },
      {
        id: 'ev-c3-bed',
        hotspotId: 'spot-c3-bed',
        title: 'Silk Duvet Bed',
        category: 'PHYSICAL',
        icon: '🛏️',
        shortDesc: 'Pillows and bed linens are smoothed and undisturbed.',
        keyFact: 'Confirms no struggle or frantic search occurred inside the suite.',
        timestamp: '8:40 PM'
      },
      {
        id: 'ev-c3-bag',
        hotspotId: 'spot-c3-bag',
        title: 'Emma\'s Evening Handbag',
        category: 'PHYSICAL',
        icon: '👜',
        shortDesc: 'Satin handbag resting on the side table.',
        keyFact: 'Contains cosmetics, compact mirror, and keycard. No jewelry inside.',
        timestamp: '8:15 PM'
      },
      {
        id: 'ev-c3-mirror',
        hotspotId: 'spot-c3-mirror',
        title: 'Illuminated Vanity Mirror',
        category: 'PHYSICAL',
        icon: '🪞',
        shortDesc: 'Open velvet jewelry case sitting under vanity lights.',
        keyFact: 'Empty velvet indentation matches the missing sapphire necklace.',
        timestamp: '8:42 PM'
      },
      {
        id: 'ev-c3-window',
        hotspotId: 'spot-c3-window',
        title: 'Balcony French Window',
        category: 'PHYSICAL',
        icon: '🪟',
        shortDesc: 'Double-glazed balcony window overlooking the garden.',
        keyFact: 'Window latch is locked from the inside. Outside entry impossible.',
        timestamp: '8:44 PM'
      }
    ],

    suspects: [
      {
        id: 's-c3-emma',
        name: 'Emma',
        role: 'Victim\'s Friend',
        avatarText: 'EM',
        avatarBg: '#ec4899',
        alibi: '"Left the room at 8:15 PM."',
        suspicious: 'She had access to the room.'
      },
      {
        id: 's-c3-ryan',
        name: 'Ryan',
        role: 'Room Service',
        avatarText: 'RY',
        avatarBg: '#3b82f6',
        alibi: '"Entered at 8:30 PM to deliver food."',
        suspicious: 'He was inside after the necklace disappeared.'
      },
      {
        id: 's-c3-mia',
        name: 'Mia',
        role: 'Housekeeping',
        avatarText: 'MI',
        avatarBg: '#10b981',
        alibi: '"Cleaned the room at 8:00 PM."',
        suspicious: 'A blue thread matching the necklace was found on her cleaning cart.'
      }
    ],

    timeline: [
      {
        id: 't-c3-1',
        time: '8:00 PM',
        title: 'Mia Enters Room',
        text: 'Mia enters Suite 402 with housekeeping cart to clean room.',
        locked: false
      },
      {
        id: 't-c3-2',
        time: '8:05 PM',
        title: 'Emma Enters Room',
        text: 'Emma enters Suite 402 to meet the victim before dinner.',
        locked: false
      },
      {
        id: 't-c3-3',
        time: '8:15 PM',
        title: 'Emma Leaves Room',
        text: 'Emma leaves the room to head downstairs to the restaurant.',
        locked: false
      },
      {
        id: 't-c3-4',
        time: '8:20 PM',
        title: 'Necklace Visible in Photo',
        text: 'Phone photo shows the necklace was clearly visible on vanity at 8:20 PM.',
        locked: true,
        unlockClue: 'ev-c3-phone'
      },
      {
        id: 't-c3-5',
        time: '8:30 PM',
        title: 'Ryan Enters for Delivery',
        text: 'Ryan enters Suite 402 to deliver room service meal and exits.',
        locked: true,
        unlockClue: 'ev-c3-tray'
      }
    ],

    solution: {
      culpritId: 's-c3-mia',
      validEvidenceIds: ['ev-c3-cart'],
      correctEvidenceId: 'ev-c3-cart',
      correctTheoryId: 'th-c3-1',

      evidenceOptions: [
        { id: 'ev-c3-cart', text: 'Blue thread on housekeeping cart.' },
        { id: 'ev-c3-phone', text: 'Phone photo showing necklace at 8:20 PM.' },
        { id: 'ev-c3-tray', text: 'Room-service receipt stamped 8:30 PM.' }
      ],
      theoryOptions: [
        { id: 'th-c3-1', text: 'Mia took the necklace while cleaning the room, and the blue thread caught on her cart.' },
        { id: 'th-c3-2', text: 'Emma took the necklace in her handbag when leaving at 8:15 PM.' },
        { id: 'th-c3-3', text: 'Ryan stole the necklace while dropping off the room-service food.' }
      ],
      revealSteps: [
        'Necklace was visible at 8:20 PM.',
        'Emma had already left.',
        'Ryan arrived at 8:30 PM.',
        'Blue thread matching the necklace was found on Mia\'s cleaning cart.',
        'Mia took the necklace while cleaning the room.'
      ]
    }
  }
};

// ==========================================================================
// 2. Application State
// ==========================================================================
const state = {
  currentCaseId: null,
  discoveredClues: new Set(),
  startTime: null,
  elapsedSeconds: 0,
  timerInterval: null,
  soundEnabled: true,
  narrationEnabled: true,
  audioCtx: null,

  deduction: {
    selectedSuspect: null,
    selectedEvidence: null,
    selectedTheory: null
  }
};

// ==========================================================================
// 3. Audio & Voice Synthesizer
// ==========================================================================
function initAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!state.audioCtx && AudioContextClass) {
    state.audioCtx = new AudioContextClass();
  }
  if (state.audioCtx && state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }
}

function playSound(type) {
  if (!state.soundEnabled) return;
  try {
    initAudio();
    if (!state.audioCtx) return;
    const now = state.audioCtx.currentTime;

    switch (type) {
      case 'clue': {
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.28);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(state.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }

      case 'type': {
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(state.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case 'solve': {
        [440, 554.37, 659.25, 880].forEach((freq, i) => {
          const osc = state.audioCtx.createOscillator();
          const gain = state.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          gain.gain.setValueAtTime(0.1, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
          osc.connect(gain);
          gain.connect(state.audioCtx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.55);
        });
        break;
      }

      case 'error': {
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(state.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
    }
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

function speakText(text) {
  if (!state.narrationEnabled) return;
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.92;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.debug('Speech error:', e);
  }
}

function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// ==========================================================================
// 4. Case Management & Navigation
// ==========================================================================
function initDashboard() {
  renderCaseCards();
  initThemeAndSound();
}

function renderCaseCards() {
  const container = document.getElementById('cases-grid');
  if (!container) return;
  container.innerHTML = '';

  Object.values(CASES_DB).forEach(c => {
    const isSolved = localStorage.getItem(`casefile_${c.id}_solved`) === 'true';
    const rank = localStorage.getItem(`casefile_${c.id}_rank`) || '';

    const card = document.createElement('article');
    card.className = `case-select-card ${isSolved ? 'case-completed' : ''}`;
    card.innerHTML = `
      <div class="card-glow"></div>
      <div class="case-card-top">
        <span class="case-num-badge">${c.number}</span>
        <span class="case-diff-badge ${c.badgeClass}">${c.difficulty}</span>
      </div>

      <div class="case-visual-preview">
        <span class="preview-case-icon">${c.thumbIcon}</span>
        <div class="preview-case-loc">${c.location.split('—')[0].trim()}</div>
      </div>

      <div class="case-card-body">
        <h3 class="case-card-title">${c.title}</h3>
        <p class="case-card-sub">${c.subtitle}</p>
      </div>

      <div class="case-card-footer">
        <div class="case-status-indicator">
          ${isSolved ? `<span class="badge-solved">★ SOLVED${rank ? ' • ' + rank : ''}</span>` : '<span class="badge-open">AVAILABLE</span>'}
        </div>
        <button class="btn-play-case" data-case-id="${c.id}">
          <span>${isSolved ? 'RE-INVESTIGATE' : 'INVESTIGATE'}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    `;

    card.querySelector('.btn-play-case').addEventListener('click', () => {
      startCaseIntro(c.id);
    });

    container.appendChild(card);
  });
}

// ==========================================================================
// 5. Cinematic Typewriter Introduction
// ==========================================================================
let introTimeout = null;

function startCaseIntro(caseId) {
  state.currentCaseId = caseId;
  const c = CASES_DB[caseId];
  if (!c) return;

  switchScreen('screen-cinematic');
  stopSpeaking();

  const beatsContainer = document.getElementById('cinematic-beats');
  const titleEl = document.getElementById('cinematic-case-title');
  const numEl = document.getElementById('cinematic-case-num');

  if (titleEl) titleEl.textContent = c.title;
  if (numEl) numEl.textContent = c.number;
  if (beatsContainer) beatsContainer.innerHTML = '';

  speakText(c.voiceIntro);

  let beatIndex = 0;

  function nextBeat() {
    if (beatIndex >= c.introBeats.length) {
      document.getElementById('btn-cinematic-start').classList.add('pulse-ready');
      return;
    }

    const text = c.introBeats[beatIndex];
    const beatEl = document.createElement('div');
    beatEl.className = 'cinematic-beat-line';
    if (beatIndex === c.introBeats.length - 1) {
      beatEl.classList.add('final-beat');
    }
    beatEl.textContent = text;
    beatsContainer.appendChild(beatEl);
    playSound('type');

    beatIndex++;
    introTimeout = setTimeout(nextBeat, 1100);
  }

  nextBeat();
}

function skipCinematic() {
  if (introTimeout) clearTimeout(introTimeout);
  stopSpeaking();
  launchInvestigationArena(state.currentCaseId);
}

// ==========================================================================
// 6. Investigation Arena Initialization
// ==========================================================================
function launchInvestigationArena(caseId) {
  state.currentCaseId = caseId;
  const c = CASES_DB[caseId];
  if (!c) return;

  switchScreen('screen-investigation');
  stopSpeaking();

  state.discoveredClues.clear();
  state.elapsedSeconds = 0;
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.startTime = Date.now();
  state.timerInterval = setInterval(updateInvestigationTimer, 1000);

  document.getElementById('active-case-title').textContent = `${c.number}: ${c.title}`;
  document.getElementById('scene-name').textContent = c.sceneTitle;
  document.getElementById('scene-tagline').textContent = c.sceneDesc;

  renderCrimeScene(c);
  renderSuspects(c);
  renderEvidenceBoard(c);
  renderTimeline(c);
  loadCaseNotes(c.id);
  updateHUD(c);
  switchTab('scene');
}

function updateInvestigationTimer() {
  state.elapsedSeconds++;
  const m = Math.floor(state.elapsedSeconds / 60).toString().padStart(2, '0');
  const s = (state.elapsedSeconds % 60).toString().padStart(2, '0');
  const el = document.getElementById('hud-time-val');
  if (el) el.textContent = `${m}:${s}`;
}

// ==========================================================================
// 7. Visual Crime Scene Renderer
// ==========================================================================
function renderCrimeScene(c) {
  const sceneArea = document.getElementById('scene-interactive-area');
  if (!sceneArea) return;

  sceneArea.className = `scene-interactive-area theme-${c.id}`;
  sceneArea.innerHTML = '';

  const roomBackdrop = document.createElement('div');
  roomBackdrop.className = `scene-backdrop-canvas bg-${c.id}`;
  sceneArea.appendChild(roomBackdrop);

  c.evidence.forEach(ev => {
    const isDiscovered = state.discoveredClues.has(ev.id);
    const spotBtn = document.createElement('button');
    spotBtn.className = `scene-hotspot ${ev.hotspotId} ${isDiscovered ? 'discovered' : ''}`;
    spotBtn.id = ev.hotspotId;
    spotBtn.setAttribute('aria-label', `Inspect ${ev.title}`);
    spotBtn.innerHTML = `
      <div class="hotspot-pulse"></div>
      <div class="hotspot-bubble">
        <span class="hotspot-emoji">${ev.icon}</span>
        <span class="hotspot-caption">${ev.title.split(' ')[0]}</span>
      </div>
    `;

    spotBtn.addEventListener('click', () => {
      inspectClue(ev.id);
    });

    sceneArea.appendChild(spotBtn);
  });
}

// ==========================================================================
// 8. Inspecting & Discovering Clues
// ==========================================================================
function inspectClue(clueId) {
  const c = CASES_DB[state.currentCaseId];
  if (!c) return;

  const ev = c.evidence.find(e => e.id === clueId);
  if (!ev) return;

  const isFirstTime = !state.discoveredClues.has(ev.id);
  state.discoveredClues.add(ev.id);

  if (isFirstTime) {
    playSound('clue');
    showClueToast(ev.title);
  }

  const spotEl = document.getElementById(ev.hotspotId);
  if (spotEl) spotEl.classList.add('discovered');

  updateHUD(c);
  renderEvidenceBoard(c);
  renderTimeline(c);

  openClueModal(ev);

  if (isFirstTime) {
    speakText(`Clue found: ${ev.title}. ${ev.keyFact}`);
  }
}

function openClueModal(ev) {
  const modal = document.getElementById('modal-clue-detail');
  if (!modal) return;

  document.getElementById('modal-clue-icon').textContent = ev.icon;
  document.getElementById('modal-clue-title').textContent = ev.title;
  document.getElementById('modal-clue-cat').textContent = ev.category;
  document.getElementById('modal-clue-time').textContent = ev.timestamp;
  document.getElementById('modal-clue-obs').textContent = ev.shortDesc;
  document.getElementById('modal-clue-fact').textContent = ev.keyFact;

  modal.classList.remove('hidden');
}

function closeClueModal() {
  const modal = document.getElementById('modal-clue-detail');
  if (modal) modal.classList.add('hidden');
}

// ==========================================================================
// 9. Evidence Board Renderer
// ==========================================================================
function renderEvidenceBoard(c) {
  const container = document.getElementById('evidence-grid');
  if (!container) return;
  container.innerHTML = '';

  c.evidence.forEach(ev => {
    const isFound = state.discoveredClues.has(ev.id);
    const card = document.createElement('div');
    card.className = `evidence-polaroid ${isFound ? 'found' : 'locked'}`;

    if (isFound) {
      card.innerHTML = `
        <div class="evidence-icon-badge">${ev.icon}</div>
        <div class="evidence-details">
          <div class="evidence-meta">
            <span class="evidence-cat">${ev.category}</span>
            <span class="evidence-time">⏱️ ${ev.timestamp}</span>
          </div>
          <h4 class="evidence-title">${ev.title}</h4>
          <p class="evidence-fact"><strong>Key Fact:</strong> ${ev.keyFact}</p>
        </div>
      `;
      card.addEventListener('click', () => openClueModal(ev));
    } else {
      card.innerHTML = `
        <div class="locked-clue-box">
          <span class="locked-icon">🔒</span>
          <span class="locked-title">UNDISCOVERED CLUE</span>
          <span class="locked-sub">Inspect crime scene to uncover</span>
        </div>
      `;
    }

    container.appendChild(card);
  });
}

// ==========================================================================
// 10. Interactive Timeline
// ==========================================================================
function renderTimeline(c) {
  const container = document.getElementById('timeline-list');
  if (!container) return;
  container.innerHTML = '';

  c.timeline.forEach(t => {
    let isUnlocked = !t.locked;
    if (t.locked && t.unlockClue) {
      isUnlocked = state.discoveredClues.has(t.unlockClue);
    }

    const item = document.createElement('div');
    item.className = `timeline-item ${isUnlocked ? 'unlocked' : 'locked'}`;

    item.innerHTML = `
      <div class="timeline-marker">
        <span class="marker-dot"></span>
        <span class="marker-time">${t.time}</span>
      </div>
      <div class="timeline-card">
        ${isUnlocked ? `
          <h4 class="timeline-title">${t.title}</h4>
          <p class="timeline-text">${t.text}</p>
        ` : `
          <div class="timeline-locked-state">
            <span class="lock-icon">🔒</span>
            <span class="lock-msg">LOCKED TIMELINE EVENT</span>
            <span class="lock-hint">Discover related evidence to unlock timestamp</span>
          </div>
        `}
      </div>
    `;

    container.appendChild(item);
  });
}

// ==========================================================================
// 11. Suspects Board
// ==========================================================================
function renderSuspects(c) {
  const container = document.getElementById('suspects-grid');
  if (!container) return;
  container.innerHTML = '';

  c.suspects.forEach(s => {
    const card = document.createElement('article');
    card.className = 'suspect-profile-card';

    card.innerHTML = `
      <div class="suspect-card-header">
        <div class="suspect-avatar" style="background: ${s.avatarBg}">
          ${s.avatarText}
        </div>
        <div class="suspect-meta">
          <h3 class="suspect-name">${s.name}</h3>
          <span class="suspect-role">${s.role}</span>
        </div>
      </div>
      <div class="suspect-card-body">
        <div class="suspect-data-row">
          <span class="row-label">ALIBI:</span>
          <p class="alibi-text">${s.alibi}</p>
        </div>
        <div class="suspect-data-row suspicious-row">
          <span class="row-label">SUSPICIOUS:</span>
          <p class="suspicious-text">${s.suspicious}</p>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// ==========================================================================
// 12. Case Notes with LocalStorage Persistence
// ==========================================================================
function loadCaseNotes(caseId) {
  const textarea = document.getElementById('case-notes-input');
  if (!textarea) return;

  const saved = localStorage.getItem(`casefile_notes_${caseId}`) || '';
  textarea.value = saved;

  textarea.oninput = () => {
    localStorage.setItem(`casefile_notes_${caseId}`, textarea.value);
  };
}

// ==========================================================================
// 13. HUD & Toast Helpers
// ==========================================================================
function updateHUD(c) {
  const totalClues = c.evidence.length;
  const foundClues = state.discoveredClues.size;

  const elEv = document.getElementById('hud-evidence-count');
  if (elEv) elEv.textContent = `${foundClues} / ${totalClues}`;

  const elSusp = document.getElementById('hud-suspects-count');
  if (elSusp) elSusp.textContent = `${c.suspects.length}`;

  let unlockedTime = 0;
  c.timeline.forEach(t => {
    if (!t.locked || state.discoveredClues.has(t.unlockClue)) unlockedTime++;
  });
  const elTime = document.getElementById('hud-timeline-count');
  if (elTime) elTime.textContent = `${unlockedTime} / ${c.timeline.length}`;
}

function showClueToast(title) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'detective-toast';
  toast.innerHTML = `
    <span class="toast-badge">🔍 CLUE DISCOVERED</span>
    <span class="toast-title">${title}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 2400);
}

// ==========================================================================
// 14. Deduction Phase & Interactive Accusation Modal
// ==========================================================================
function openDeductionModal() {
  const c = CASES_DB[state.currentCaseId];
  if (!c) return;

  const modal = document.getElementById('modal-deduction');
  if (!modal) return;

  state.deduction.selectedSuspect = null;
  state.deduction.selectedEvidence = null;
  state.deduction.selectedTheory = null;

  renderDeductionStep1(c);
  showDeductionStep(1);

  modal.classList.remove('hidden');
}

function closeDeductionModal() {
  const modal = document.getElementById('modal-deduction');
  if (modal) modal.classList.add('hidden');
}

function showDeductionStep(stepNum) {
  document.querySelectorAll('.deduction-step-pane').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`deduction-step-${stepNum}`);
  if (target) target.classList.add('active');

  document.querySelectorAll('.step-pip').forEach((pip, idx) => {
    if (idx + 1 === stepNum) pip.classList.add('active');
    else if (idx + 1 < stepNum) pip.classList.add('completed');
    else pip.classList.remove('active', 'completed');
  });
}

function renderDeductionStep1(c) {
  const container = document.getElementById('step-1-suspects-list');
  if (!container) return;
  container.innerHTML = '';

  c.suspects.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'deduction-option-card';
    btn.innerHTML = `
      <div class="option-avatar" style="background: ${s.avatarBg}">${s.avatarText}</div>
      <div class="option-info">
        <strong>${s.name}</strong>
        <span>${s.role}</span>
      </div>
    `;

    btn.addEventListener('click', () => {
      document.querySelectorAll('#step-1-suspects-list .deduction-option-card').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.deduction.selectedSuspect = s.id;
      document.getElementById('btn-next-step-1').disabled = false;
    });

    container.appendChild(btn);
  });

  const nextBtn = document.getElementById('btn-next-step-1');
  nextBtn.disabled = true;
  nextBtn.onclick = () => {
    renderDeductionStep2(c);
    showDeductionStep(2);
  };
}

function renderDeductionStep2(c) {
  const container = document.getElementById('step-2-evidence-list');
  if (!container) return;
  container.innerHTML = '';

  c.solution.evidenceOptions.forEach(evOpt => {
    const btn = document.createElement('button');
    btn.className = 'deduction-option-card';
    btn.innerHTML = `
      <div class="option-info">
        <strong>${evOpt.text}</strong>
      </div>
    `;

    btn.addEventListener('click', () => {
      document.querySelectorAll('#step-2-evidence-list .deduction-option-card').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.deduction.selectedEvidence = evOpt.id;
      document.getElementById('btn-next-step-2').disabled = false;
    });

    container.appendChild(btn);
  });

  const nextBtn = document.getElementById('btn-next-step-2');
  nextBtn.disabled = true;
  nextBtn.onclick = () => {
    renderDeductionStep3(c);
    showDeductionStep(3);
  };
}

function renderDeductionStep3(c) {
  const container = document.getElementById('step-3-theory-list');
  if (!container) return;
  container.innerHTML = '';

  c.solution.theoryOptions.forEach(thOpt => {
    const btn = document.createElement('button');
    btn.className = 'deduction-option-card';
    btn.innerHTML = `
      <div class="option-info">
        <p>${thOpt.text}</p>
      </div>
    `;

    btn.addEventListener('click', () => {
      document.querySelectorAll('#step-3-theory-list .deduction-option-card').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.deduction.selectedTheory = thOpt.id;
      document.getElementById('btn-submit-verdict').disabled = false;
    });

    container.appendChild(btn);
  });

  const submitBtn = document.getElementById('btn-submit-verdict');
  submitBtn.disabled = true;
  submitBtn.onclick = evaluateDeduction;
}

// ==========================================================================
// 15. Solution Reveal & Scoring
// ==========================================================================
function evaluateDeduction() {
  const c = CASES_DB[state.currentCaseId];
  if (!c) return;

  const isCorrectSuspect = state.deduction.selectedSuspect === c.solution.culpritId;
  const isCorrectEvidence = state.deduction.selectedEvidence === c.solution.correctEvidenceId;
  const isCorrectTheory = state.deduction.selectedTheory === c.solution.correctTheoryId;

  const isSolved = isCorrectSuspect && isCorrectEvidence && isCorrectTheory;

  showDeductionStep(4);
  const resultCard = document.getElementById('verdict-result-card');

  if (isSolved) {
    playSound('solve');
    speakText('Case Solved! Outstanding deduction. You have uncovered the truth.');

    localStorage.setItem(`casefile_${c.id}_solved`, 'true');

    const totalClues = c.evidence.length;
    const foundClues = state.discoveredClues.size;
    const timeSecs = state.elapsedSeconds;

    let baseScore = 60;
    baseScore += Math.round((foundClues / totalClues) * 30);
    if (timeSecs < 180) baseScore += 10;
    else if (timeSecs < 300) baseScore += 5;
    const finalScore = Math.min(100, baseScore);

    let rank = 'NOVICE';
    if (c.id === 'case003') {
      if (finalScore >= 85) rank = 'JUNIOR DETECTIVE';
      else rank = 'ROOKIE';
    } else {
      if (finalScore >= 95) rank = 'MASTER DETECTIVE';
      else if (finalScore >= 85) rank = 'DETECTIVE';
      else if (finalScore >= 70) rank = 'INVESTIGATOR';
    }

    localStorage.setItem(`casefile_${c.id}_score`, `${finalScore}%`);
    localStorage.setItem(`casefile_${c.id}_rank`, rank);

    const m = Math.floor(timeSecs / 60).toString().padStart(2, '0');
    const s = (timeSecs % 60).toString().padStart(2, '0');

    resultCard.className = 'verdict-card verdict-success';
    resultCard.innerHTML = `
      <div class="verdict-badge-banner">CASE SOLVED</div>
      <h2 class="verdict-culprit">THE CULPRIT: ${c.suspects.find(s => s.id === c.solution.culpritId).name}</h2>

      <div class="reveal-steps-box">
        <h4>FORENSIC RECONSTRUCTION</h4>
        <ul class="reveal-list">
          ${c.solution.revealSteps.map(step => `
            <li class="reveal-item">
              <span class="check-icon">✓</span>
              <span>${step}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="verdict-score-grid">
        <div class="score-pill">
          <span class="score-label">EVIDENCE FOUND</span>
          <strong class="score-val">${foundClues} / ${totalClues}</strong>
        </div>
        <div class="score-pill">
          <span class="score-label">ACCURACY</span>
          <strong class="score-val">100%</strong>
        </div>
        <div class="score-pill">
          <span class="score-label">INVESTIGATION TIME</span>
          <strong class="score-val">${m}:${s}</strong>
        </div>
        <div class="score-pill rank-pill">
          <span class="score-label">RANK</span>
          <strong class="score-val">🕵️ ${rank}</strong>
        </div>
      </div>

      <div class="verdict-actions">
        <button id="btn-return-dashboard" class="btn-primary-action">
          <span>RETURN TO CASE DASHBOARD</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    `;

    document.getElementById('btn-return-dashboard').addEventListener('click', () => {
      closeDeductionModal();
      switchScreen('screen-dashboard');
      renderCaseCards();
    });

  } else {
    playSound('error');

    let feedback = '';
    if (!isCorrectSuspect) {
      feedback = 'Your accusation points to an innocent person whose alibi is supported by forensic timestamps.';
    } else if (!isCorrectEvidence) {
      feedback = 'You identified the right suspect, but your chosen evidence does not conclusively shatter their alibi.';
    } else {
      feedback = 'Your theory of events contains logical flaws contradicted by crime scene physical proof.';
    }

    speakText('The deduction contains contradictions. Re-examine the clues.');

    resultCard.className = 'verdict-card verdict-failure';
    resultCard.innerHTML = `
      <div class="verdict-badge-banner failure-banner">CONTRADICTION DETECTED</div>
      <h2 class="verdict-culprit failure-title">INSUFFICIENT PROOF</h2>
      <p class="failure-feedback">${feedback}</p>

      <div class="verdict-actions">
        <button id="btn-retry-deduction" class="btn-primary-action">
          <span>RE-EXAMINE EVIDENCE</span>
        </button>
      </div>
    `;

    document.getElementById('btn-retry-deduction').addEventListener('click', () => {
      closeDeductionModal();
    });
  }
}

// ==========================================================================
// 16. Screen & Tab Navigation
// ==========================================================================
function switchScreen(screenId) {
  document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchTab(tabName) {
  document.querySelectorAll('.dash-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-pane').forEach(p => {
    p.classList.toggle('active', p.id === `tab-${tabName}`);
  });
}

function initThemeAndSound() {
  const btnSound = document.getElementById('btn-sound');
  const btnVoice = document.getElementById('btn-voice');

  const savedSound = localStorage.getItem('casefile_sound');
  state.soundEnabled = savedSound !== 'false';
  updateSoundUI();

  if (btnSound) {
    btnSound.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem('casefile_sound', state.soundEnabled ? 'true' : 'false');
      updateSoundUI();
    });
  }

  const savedVoice = localStorage.getItem('casefile_narration');
  state.narrationEnabled = savedVoice !== 'false';
  updateVoiceUI();

  if (btnVoice) {
    btnVoice.addEventListener('click', () => {
      state.narrationEnabled = !state.narrationEnabled;
      localStorage.setItem('casefile_narration', state.narrationEnabled ? 'true' : 'false');
      updateVoiceUI();
      if (!state.narrationEnabled) stopSpeaking();
      else speakText('Voice narration enabled.');
    });
  }
}

function updateSoundUI() {
  const iconOn = document.getElementById('sound-icon-on');
  const iconOff = document.getElementById('sound-icon-off');
  if (iconOn && iconOff) {
    iconOn.classList.toggle('hidden', !state.soundEnabled);
    iconOff.classList.toggle('hidden', state.soundEnabled);
  }
}

function updateVoiceUI() {
  const btnVoice = document.getElementById('btn-voice');
  if (!btnVoice) return;
  btnVoice.classList.toggle('voice-muted', !state.narrationEnabled);
  btnVoice.setAttribute('title', state.narrationEnabled ? 'Voice Narration: ON' : 'Voice Narration: MUTED');
}

// ==========================================================================
// 17. Initialization & Event Binding
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initDashboard();

  const btnSkip = document.getElementById('btn-cinematic-skip');
  if (btnSkip) btnSkip.addEventListener('click', skipCinematic);

  const btnStart = document.getElementById('btn-cinematic-start');
  if (btnStart) btnStart.addEventListener('click', skipCinematic);

  const btnBackCases = document.getElementById('btn-back-cases');
  if (btnBackCases) {
    btnBackCases.addEventListener('click', () => {
      if (state.timerInterval) clearInterval(state.timerInterval);
      stopSpeaking();
      switchScreen('screen-dashboard');
      renderCaseCards();
    });
  }

  document.querySelectorAll('.dash-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });

  const btnCloseClue = document.getElementById('btn-close-clue');
  if (btnCloseClue) btnCloseClue.addEventListener('click', closeClueModal);

  const clueModalBackdrop = document.getElementById('modal-clue-detail');
  if (clueModalBackdrop) {
    clueModalBackdrop.addEventListener('click', (e) => {
      if (e.target === clueModalBackdrop) closeClueModal();
    });
  }

  const btnOpenAccuse = document.getElementById('btn-open-accusation');
  if (btnOpenAccuse) btnOpenAccuse.addEventListener('click', openDeductionModal);

  const btnCloseDeduce = document.getElementById('btn-close-deduction');
  if (btnCloseDeduce) btnCloseDeduce.addEventListener('click', closeDeductionModal);
});
