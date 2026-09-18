# SYNAPSE — Modern Web Mini-Game Hub

> **College Mini-Project | Course: AI Tools**  
> **Tagline:** *PLAY. THINK. MASTER.*  
> **Created by:** Ajsal & Sreenandh

**SYNAPSE** is a modern, responsive web mini-game platform hosting three distinct browser games engineered with pure vanilla web technologies (HTML5, CSS3, ES6+ JavaScript). It features zero external framework dependencies, zero build steps, and runs 100% locally and offline.

---

## 🎮 The Games Catalog

### 1. 🟩 LexIQ — 5-Letter Word Guessing Game
* **Tagline:** *Guess the word. Crack the puzzle.*
* **Category:** Vocabulary Strategy • Medium • 6 Attempts
* **Key Features:**
  - Classic Wordle-inspired mechanic with original branding and typography visual identity.
  - Robust **two-pass evaluation algorithm** handling duplicate letters with mathematical accuracy.
  - Dual input: on-screen touch keyboard and physical keyboard support.
  - Two-stage smart hint system (positional reveal + semantic definition clue).
  - Score weighting based on attempts and consecutive win streak counter.

### 2. ⚡ TEN — 10-Second Reflex & Brain Blitz
* **Tagline:** *10 seconds. One challenge. Can you beat the clock?*
* **Category:** Brain Agility & Reflex Speed • Fast • 10s per Round
* **Key Features:**
  - 10 randomized rounds from 8 cognitive challenge types (Math, Odd One Out, Shape Counting, Patterns, Memory Flash, Quick Sort, Target Click, Reaction Strike).
  - High-precision countdown ring with color-coded urgency states (Calm Cyan → Warning Amber → Intense Red).
  - Dynamic combo multiplier (1.0x to 2.5x) and speed bonus scoring.

### 3. 🔍 CASEFILE — Forensic Detective Investigation
* **Tagline:** *Observe. Investigate. Solve.*
* **Category:** Logic & Mystery • Case #001: The Missing Trophy
* **Key Features:**
  - **Interactive Crime Scene:** Clickable 3D-styled isometric room layout to inspect physical and forensic clues (desk drawer, trophy pedestal, camera feed, breaker panel, boot treads, etc.).
  - **Suspect Cross-Examinations:** Question 4 distinct suspects to reveal motives, whereabouts, and contradictory statements.
  - **Automated Evidence Board & Timeline:** Chronological timeline reconstruction tracking timestamps from 18:30 to 21:00.
  - **In-Game Case Notes:** Persistent detective scratchpad saved automatically in browser `localStorage`.
  - **Accusation System:** Solvable deterministic logic requiring the user to identify the true culprit and pair them with conclusive forensic proof.

---

## 🛠️ Architecture & Technology Stack

| Technology | Implementation Details |
| :--- | :--- |
| **HTML5** | Semantic markup, modal dialogs, accessible SVG iconography, ARIA live regions |
| **CSS3** | CSS custom properties (design tokens), dark & light themes, CSS Grid, Flexbox, hardware-accelerated animations |
| **Vanilla JavaScript (ES6+)** | Zero dependencies, modular game state controllers, deterministic verification, persistent `localStorage` |
| **Web Audio API** | Algorithmic sound synthesis (keystrokes, chimes, timers, ticks, victory fanfares) without external `.mp3` files |

---

## 📂 Project Structure

```text
word-guessing-game/
├── index.html              # SYNAPSE Game Hub (Hero, Catalog, Guides, Features)
├── hub.css                 # Platform styling, gaming dark/light themes, animations
├── hub.js                  # Platform theme toggle, live stats aggregator, sound effects
│
├── lexiq/                  # Game 1: LexIQ Word Puzzle
│   ├── index.html          # Game layout, grid, virtual keyboard, modals
│   ├── style.css           # Board grid, tile animations, theme variables
│   ├── script.js           # Two-pass evaluator, hint engine, stats manager
│   └── words.js            # Target words database and valid dictionary bank
│
├── ten/                    # Game 2: TEN Reflex Blitz
│   ├── index.html          # Blitz arena, progress ribbon, HUD, result cards
│   ├── ten.css             # Countdown ring, combo meter, urgency states
│   └── ten.js              # 8 challenge generators, 10s timer engine, SFX
│
├── casefile/               # Game 3: CASEFILE Detective Mystery
│   ├── index.html          # Briefing, interactive room, suspect dossiers, notes
│   ├── casefile.css        # Cinematic detective UI, pinboard, evidence cards
│   └── casefile.js         # Case #001 engine, inspection logic, accusation validator
│
├── render.yaml             # Render cloud deployment blueprint
└── README.md               # Platform documentation and AI development breakdown
```

---

## 🚀 How to Run Locally

### Option 1: Direct Browser Launch (No Install Required)
1. Open the project folder in File Explorer.
2. Double-click **`index.html`** to launch the SYNAPSE Game Hub in any browser (Chrome, Edge, Firefox, Safari).
3. Click any game card to launch into LexIQ, TEN, or CASEFILE.

### Option 2: Local HTTP Server (Optional)
```bash
# Python 3
python -m http.server 8000

# Open http://localhost:8000 in your browser
```

---

## ☁️ Deployment on Render

This repository includes a `render.yaml` static site configuration:
1. Push this repository to GitHub.
2. Link your GitHub repo to [Render](https://dashboard.render.com).
3. Choose **Static Site**, leave **Build Command** empty, and set **Publish Directory** to `.`.
4. Deploy — Render will host the entire platform with free SSL at a custom live URL.

---

## 🧠 AI-Assisted Development Breakdown

Developed for the **AI Tools** academic course, AI techniques and tooling were utilized for:
1. **System Architecture Design:** Structuring a multi-game hub with decoupled sub-applications that share a unified visual design system.
2. **Algorithmic Correctness:** Formulating the two-pass letter frequency algorithm in LexIQ to handle edge cases like repeated letters.
3. **Procedural Challenge Generation:** Crafting 8 distinct mathematical and pattern algorithms for the TEN reflex engine with dynamic difficulty scaling.
4. **Logic Mystery Puzzle Construction:** Designing a coherent, non-contradictory forensic mystery graph for Case #001 with timestamps, suspect alibis, and conclusive proof triggers.
5. **Zero-Asset Web Audio:** Designing purely algorithmic procedural audio waveforms using browser `AudioContext` nodes.

---

## 👨‍🎓 Academic Course Submission

* **Course:** AI Tools (Semester 5)
* **Project:** Web Mini-Game Hub
* **Developers:** Ajsal & Sreenandh
