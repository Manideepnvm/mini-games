# 🎮 Mini Multiplayer Games - Quick Reference Guide

## 📂 Project Structure at a Glance

```
c:\projects\mini games app\
├── index.html              Main menu hub (173 lines)
├── main.js                 Game controller (459 lines)
├── styles.css              Dark-themed styling (1,058 lines)
├── PROJECT_DETAILS.md      Complete documentation
├── .git/                   Version control
└── games/
    ├── 2-PLAYER GAMES:
    │   ├── tictactoe.js + tictactoe.html
    │   ├── rockpaperscissors.js + rock-paper-scissors.html
    │   ├── battleship.js + battleship.html
    │   ├── checkers.js + checkers.html
    │   └── dotsandboxes.js + dots-and-boxes.html
    │
    └── 4-PLAYER GAMES:
        ├── uno.js + uno.html
        ├── snakerace.js + snake-race.html
        ├── ludo.js + ludo.html
        ├── fourplayerpong.js + pong-4p.html
        └── triviashowdown.js + trivia-showdown.html
```

---

## 🎮 Game Index

| # | Game | Type | Players | Canvas | File | Controls |
|---|------|------|---------|--------|------|----------|
| 1 | ❌⭕ Tic Tac Toe | Strategy | 2 | 800×600 | `tictactoe.js` | Mouse click |
| 2 | ✂️📄🗿 Rock Paper Scissors | Choice | 2 | 800×600 | `rockpaperscissors.js` | Button click |
| 3 | 🚢⚓ Battleship | Strategy | 2 | 800×600 | `battleship.js` | Mouse click |
| 4 | ⚫🔴 Checkers | Board | 2 | 800×600 | `checkers.js` | Mouse drag |
| 5 | ⬜📦 Dots & Boxes | Line | 2 | SVG | `dotsandboxes.js` | Mouse click |
| 6 | 🃏🎨 Uno | Card | 4 | 800×600 | `uno.js` | Mouse click |
| 7 | 🐍🏁 Snake Race | Action | 4 | 800×600 | `snakerace.js` | Keyboard |
| 8 | 🎲🏠 Ludo | Race | 4 | 800×600 | `ludo.js` | SPACE key |
| 9 | 🏓⚡ 4P Pong | Paddle | 4 | 800×600 | `fourplayerpong.js` | Keyboard |
| 10 | 🧠❓ Trivia | Quiz | 4 | 800×600 | `triviashowdown.js` | Number keys |

---

## 🎮 Player Controls Quick Map

### **2-Player Games**
- **Tic Tac Toe:** Mouse click on grid
- **Rock Paper Scissors:** Click choice buttons
- **Battleship:** Mouse click for placement/attack
- **Checkers:** Click piece, click destination
- **Dots & Boxes:** Click between dots

### **4-Player Games**
- **Uno:** Mouse click cards
- **Snake Race:**
  - P1: Arrow Keys
  - P2: WASD
  - P3: IJKL
  - P4: TFGH
- **Ludo:** SPACE to roll dice
- **4P Pong:**
  - P1 (Left): A/Z
  - P2 (Right): I/K
  - P3 (Top): J/L
  - P4 (Bottom): D/C
- **Trivia:** Press 1/2/3/4 for answer

---

## 🚀 How to Run

```bash
# 1. Navigate to project
cd "c:\projects\mini games app"

# 2. Start server
python -m http.server 8000

# 3. Open browser
# Visit: http://localhost:8000
```

**URL:** `http://localhost:8000`  
**Port:** 8000  
**Browser:** Any modern browser

---

## 🎨 Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary BG | `#0a0a0a` | Main background |
| Secondary BG | `#1a1a1a` | Cards background |
| Accent | `#00d4ff` | Highlights |
| Success | `#00ff88` | Win/Correct |
| Warning | `#ffaa00` | Caution |
| Danger | `#ff4444` | Loss/Error |

---

## 📊 Game Statistics

- **Total Games:** 10
- **2-Player Games:** 5
- **4-Player Games:** 5
- **Canvas Size:** 800×600px (default)
- **Total Code Lines:** ~5,500+
- **CSS Lines:** 1,058
- **JavaScript Lines:** ~4,400+
- **File Count:** 23 (3 root + 20 games)

---

## 🔌 Game Module Interface

### **Required Methods**
```javascript
{
  name: 'gameName',
  init(api) { },              // Initialize
  start() { },                // Begin game
  stop() { },                 // Stop game
  handleClick(x, y, e) { },   // Mouse click
  handleKeydown(e) { },       // Key press
  handleKeyup(e) { },         // Key release
  handleMouseMove(x, y, e) { }, // Mouse move
  handleResize() { }          // Window resize
}
```

### **GameAPI Properties**
```javascript
{
  canvas,                     // Canvas element
  ctx,                        // Canvas 2D context
  gameState,                  // Game state object
  clearCanvas(),              // Clear canvas
  updateGameStatus(),         // Update status
  updatePlayerTurn(),         // Update turn
  updateScore(),              // Update score
  showToast(),                // Show notification
  returnToMenu(),             // Back to menu
  gameUtils: {
    drawText(),
    drawRect(),
    drawCircle(),
    drawLine(),
    getRandomInt(),
    distance(),
    clamp()
  }
}
```

---

## 🎯 Game Flow Diagram

```
┌─────────────────┐
│  index.html     │
│  (Main Menu)    │
└────────┬────────┘
         │ Click game card
         ▼
┌─────────────────┐
│  startGame()    │
│  (main.js)      │
└────────┬────────┘
         │ Load game module
         ▼
┌─────────────────┐
│  Game Module    │
│  init() + start()
└────────┬────────┘
         │ Game running
         ▼
┌─────────────────┐
│  Event Handlers │
│  (keyboard/mouse)
└────────┬────────┘
         │ Back to menu?
         ▼
┌─────────────────┐
│  returnToMenu() │
│  (Reset state)  │
└────────┬────────┘
         │
         └─→ Back to Main Menu
```

---

## 💾 File Size Reference

| File | Size | Type |
|------|------|------|
| index.html | ~6 KB | HTML |
| main.js | ~18 KB | JavaScript |
| styles.css | ~42 KB | CSS |
| tictactoe.js | ~6 KB | JS Module |
| battleship.js | ~20 KB | JS Module |
| checkers.js | ~18 KB | JS Module |
| Average Game | ~8-12 KB | JS Module |
| **Total** | **~300 KB** | All |

---

## 🔧 Tech Stack Summary

| Layer | Technology | Details |
|-------|-----------|---------|
| **Markup** | HTML5 | Semantic, Canvas API |
| **Styling** | CSS3 | Variables, Gradients, Animations |
| **Logic** | JavaScript ES6+ | Vanilla, IIFE modules |
| **Rendering** | Canvas 2D | Game rendering |
| **Graphics** | SVG | Dots and Boxes |
| **Events** | DOM Events | Keyboard, Mouse, Window |
| **Deployment** | HTTP Server | Python http.server |

---

## ✅ Recent Updates

- ✅ Fixed module loading system
- ✅ Refactored all games to IIFE pattern
- ✅ Implemented unified game API
- ✅ Fixed variable naming conflicts
- ✅ Added proper canvas management
- ✅ Implemented toast notifications
- ✅ Fixed game state tracking

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Games not loading | Clear cache, refresh browser |
| Canvas blank | Check browser console for errors |
| Controls not working | Click on canvas first, verify keyboard layout |
| Score not updating | Check game calls `updateScore()` |
| Menu not appearing | Verify `returnToMenu()` called correctly |

---

## 📚 Key Files to Edit

| Purpose | File | Lines |
|---------|------|-------|
| Add new game | `games/newgame.js` | New |
| Change colors | `styles.css` | 1-25 |
| Add menu items | `index.html` | 50-150 |
| Modify API | `main.js` | 360-420 |
| Game logic | `games/*.js` | Varies |

---

## 🎓 Learning Path

1. **Start with:** `index.html` (understand structure)
2. **Then study:** `main.js` (game controller)
3. **Check CSS:** `styles.css` (dark theme design)
4. **Examine game:** `games/tictactoe.js` (simple IIFE pattern)
5. **Understand API:** Game module interface requirements

---

## 📞 Quick Stats

- **Repository:** tic-tac-toe (GitHub)
- **Owner:** Manideepnvm
- **Branch:** main
- **Status:** ✅ Production Ready
- **Last Update:** November 12, 2025
- **Languages:** HTML, CSS, JavaScript
- **Framework:** None (Vanilla)
- **Dependencies:** 0 external

---

## 🎉 Ready to Play!

Your gaming hub is fully functional with 10 exciting games. Visit `http://localhost:8000` to start playing! 🚀

