echo "🚀 Generating README.md..."

cat << 'EOF' > README.md
# 🚀 Spaced Repetition Flashcard Engine

A beautiful, responsive web app that helps users master flashcards using spaced repetition logic, sleek animations, and rich progress stats — designed with a modern, neumorphic UI.

> 💡 Built for CodeCircuit Hackathon 2025.

---

## 🛠️ Tech Stack

- ⚛️ React.js – component-based UI and state handling
- 🎨 Tailwind CSS – responsive utility-first styling
- 📊 Recharts – dynamic progress visualizations
- 💾 localStorage API – persistent session + stat data
- 🌗 Dark/Light Mode – with memory
- 💡 (Optional) PWA support for offline access

---

## ✨ Features

### ✅ Core Features
- 🔁 Spaced Repetition Flashcard Review
- 👆 “Know” / “Don’t Know” review logic
- 🔄 3D Flip Card Animation
- 📊 Stats Dashboard (Donut, Line, Heatmap)
- 📈 Progress Bar and Streak Counter
- 💡 Theme Toggle with Memory (Dark/Light)
- 📱 Mobile-Responsive UI
- 💾 Persistent data via localStorage

### ➕ Advanced / Nice-to-Have
- 🗂️ Deck Management (Create/Edit/Delete Decks)
- 📤 Deck Import/Export (JSON)
- 🔇 Sound Effects for feedback
- ✨ Motivational AI Quotes
- 📴 Offline Mode (PWA-ready)
- 🎉 Confetti / Easter Eggs on Streak Milestones

---

## 🎨 UI/UX Design

- 🎛️ **Neumorphism Style:** Soft shadows, tactile feel
- 🧼 **Clean Typography:** Inter / Nunito for clarity
- 📱 **Fully Responsive:** Optimized for mobile + desktop
- 🌙 **Dark/Light Mode:** User-preference aware
- 🎬 **Smooth Transitions:** 3D flips, fade-ins, dynamic charts

> Inspired by Notion, Anki, Duolingo, and Splitwise.

---

## 📁 Folder Structure

\`\`\`
/src  
 ├── components/  
 │   ├── Flashcard.jsx  
 │   ├── ProgressBar.jsx  
 │   ├── StreakCounter.jsx  
 │   ├── StatsDashboard.jsx  
 │   ├── ThemeToggle.jsx  
 │   └── ChartComponents.jsx  
 ├── pages/  
 │   ├── HomePage.jsx  
 │   ├── ReviewPage.jsx  
 │   └── StatsPage.jsx  
 ├── utils/  
 │   ├── localStorageUtils.js  
 │   └── spacedRepetitionAlgo.js  
 ├── App.jsx  
 └── index.css (Tailwind setup)
\`\`\`

---

## 📦 Getting Started

\`\`\`bash
# 1. Clone the repo
git clone https://github.com/yourusername/flashcard-app.git
cd flashcard-app

# 2. Install dependencies
npm install --force

# 3. Start development server
npm start
\`\`\`

> Visit \`http://localhost:3000\` to run locally.

---

## ✅ Final Checklist (for Hackathon Submission)

- [x] Core features implemented
- [x] Stats + Streaks + Memory toggle
- [x] UI animations + neumorphism
- [x] Mobile-first responsive design
- [x] No console errors, all pages tested
- [x] Demo-ready walkthrough

---

## 🎤 Demo Walkthrough (What To Show)

1. 🔄 Flip a flashcard, mark as “Know/Don’t Know”
2. 📊 Show progress bar movement
3. 🎯 Highlight streak increasing
4. 📉 Visit Stats page — show donut + heatmap
5. 🌗 Toggle Dark Mode + reload to show memory

---

## 💡 Future Improvements

- AI-generated flashcards
- Flashcard search & tag filters
- Shareable public decks
- Audio-based card review
- Account login with Firebase

---

## 🏆 Built For

**CodeCircuit Hackathon 2025**  
By: Dax Gondaliya

---
