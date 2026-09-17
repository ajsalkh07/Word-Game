# LEXIQ — 5-Letter Word Guessing Game

> **College Mini-Project | Course: AI Tools**  
> **Tagline:** *Guess the word. Crack the puzzle.*

LEXIQ is a modern, responsive, beginner-friendly word puzzle web application inspired by the mechanics of Wordle, featuring an original visual identity, custom branding, smart hint system, and pure vanilla web technologies.

---

## 📸 Overview & Visual Identity

* **Name:** **LEXIQ** (Derived from *Lexicon* + *IQ* / Intelligence)
* **Logo:** Geometric 4-tile monogram with high-contrast indicator colors (Emerald Green, Gold Yellow, Indigo, Sky Blue).
* **Architecture:** Zero external frameworks, zero Node/npm dependencies, zero build steps. Runs directly in any web browser 100% offline.

---

## 🌟 Key Features

1. **Classic 6-Attempt Word Puzzle:**
   - Players have 6 attempts to guess a hidden 5-letter English word.
   - Real-time letter feedback:
     - 🟩 **Green (Correct):** Letter is in the exact position.
     - 🟨 **Yellow (Present):** Letter exists elsewhere in the word.
     - ⬜ **Gray (Absent):** Letter does not exist in the word.

2. **Accurate Two-Pass Letter Evaluation:**
   - Correctly resolves duplicate letters (e.g., guess `PUPPY` against secret word `APPLE` only highlights available occurrences without false duplicate yellows).

3. **Dual Input Methods:**
   - On-screen touch-friendly QWERTY virtual keyboard with real-time key color updates.
   - Physical keyboard listener for desktop and laptop computers (`A-Z`, `Enter`, `Backspace`).

4. **Two-Stage Smart Hint Engine (Max 2 per game):**
   - **Hint 1:** Discloses one unrevealed correct letter and its precise position (e.g., *"The 3rd letter is 'A'"*).
   - **Hint 2:** Discloses a contextual semantic clue explaining the word's meaning.
   - Dynamic button counter (`Hint (2)` → `Hint (1)` → `Hint (0)`) that disables when depleted.
   - Applying hints applies a modest penalty (-15 pts each) to keep the game balanced.

5. **Scoring & Streak Tracking:**
   - Attempt-based score weighting (100 pts on 1st attempt down to 50 pts on 6th attempt).
   - Streak counters (Current Streak & All-Time Best Streak).
   - Clean statistics modal tracking Games Played, Wins, Win Percentage, Best Score, and Recent Score using `localStorage`.

6. **Light & Dark Theme Toggle:**
   - Seamless switch between sleek Dark Slate mode and crisp Light mode.
   - Theme choice is automatically saved in `localStorage`.

7. **Zero-Dependency Web Audio Synthesizer:**
   - Pure browser **Web Audio API** sound synthesis (no external `.mp3` or `.wav` files needed).
   - Audio feedback for keystrokes, tile reveals, invalid guesses, victory arpeggios, and game over cadences.
   - Includes a one-click Sound Mute/Unmute toggle.

8. **Subtle & Accessible Animations:**
   - Letter pop-in on keypress, staggered tile 3D flip on evaluation, shake animation on invalid input, and bounce animation on victory.
   - Full support for `prefers-reduced-motion`.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure, accessible modals, SVG branding, ARIA live regions |
| **CSS3** | Modern CSS variables, Flexbox & CSS Grid, keyframe animations, mobile responsiveness |
| **Vanilla JavaScript (ES6+)** | State management, two-pass letter checking algorithm, keyboard sync, local persistence |
| **Web Audio API** | Native algorithmic audio generation with zero external assets |

---

## 📂 Project Structure

```text
word-guessing-game/
│
├── index.html        # Main HTML layout, modals, header, board grid, SVG logo
├── style.css         # Styling, light/dark themes, responsive layout, animations
├── script.js         # Core game state engine, evaluation logic, audio & event listeners
├── words.js          # Curated 5-letter target words with clues and valid guess bank
└── README.md         # Project documentation and AI development breakdown
```

---

## 🚀 How to Run the Project

### Option 1: Direct File Launch (Quickest)
1. Navigate to the `word-guessing-game` directory.
2. Double-click **`index.html`** or right-click and open it with Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.
3. The game starts immediately with no setup required!

### Option 2: Using a Local HTTP Server
If preferred (or for testing over a local network):

**Using Python:**
```bash
# In the word-guessing-game directory:
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

**Using VS Code:**
- Install the **Live Server** extension.
- Right-click `index.html` → Click **"Open with Live Server"**.

---

## 🧠 How AI Was Used During Development

As this project was developed for the **AI Tools course**, artificial intelligence assistance was actively incorporated throughout the development lifecycle:

1. **Project Ideation & Branding:**
   - Generative brainstorming of original names and concepts, avoiding trademarked terms like "Wordle" and selecting **LEXIQ**.
2. **UI & Color Contrast Design:**
   - AI recommendations for accessible color contrasts conforming to WCAG standards across both dark and light themes.
3. **Algorithm Design:**
   - Implementing the classic two-pass word evaluation logic to properly eliminate false duplicate yellow tiles when letters appear multiple times.
4. **Zero-Dependency Audio Synthesis:**
   - Generating standard Web Audio API oscillator frequencies and gain ramps to produce pleasant game sound effects without external audio files.
5. **Testing & Edge Cases:**
   - Automated testing matrices for edge-case words (such as multiple repeating vowels and consonants like `APPLE` vs `PUPPY`).
6. **Documentation & Code Clarity:**
   - Structuring beginner-friendly, clean, well-commented functions to make the project simple to explain during a college viva-voce or mini-project demonstration.

*(Note: The game itself runs purely deterministic local client-side algorithms and does not query external AI APIs during active gameplay.)*

---

## 🔮 Future Improvements

- [ ] Daily Challenge Mode (seeded by calendar date).
- [ ] Adjustable word length (4-letter, 5-letter, 6-letter modes).
- [ ] Shareable emoji grid summary (e.g., `LEXIQ 3/6 🟩🟨⬜`).
- [ ] High-contrast colorblind accessibility palette.

---

## 👨‍🎓 Academic Submission Note

* **Course:** AI Tools
* **Semester:** Semester 5
* **Project Type:** Mini-Project
* **Author:** Student Demonstration Project
