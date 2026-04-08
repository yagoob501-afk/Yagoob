# Memory Strong Game: Design Specification & AI Prompt

This document provides all the necessary technical and visual details to design the "Memory Strong" educational game.

## 1. AI Designer Tool Prompt

> **Prompt**: Design a premium, modern, and interactive educational Memory Matching game called "Memory Strong" for High School students. The interface should be RTL (Arabic-first) and feel like a high-end classroom tool. 
> 
> **Key Visual Elements ideas**:
> - **Grid System**: A dynamic grid of cards (e.g., 4x5 or 6x6) with smooth 3D flip animations using `framer-motion`.
> - **Card Design**: Cards should have a "Glassmorphism" look on the back (showing a school logo or "Memory Strong" text) and clear, legible typography on the front for Questions and Answers.
> - **Team Colors**: Vibrant team identities (e.g., Emerald Green vs Sky Blue) with glow effects for the active team's turn.
> - **Game Status**: A floating status bar showing scores, turn indicators, and a 30-second countdown timer for questions.
> - **Feedback**: Animated success/failure states, confetti for wins, and subtle micro-animations for card hovers.
> - **Typography**: Use modern Arabic fonts (like 'Outfit' or 'Cairo') with a strong hierarchy.
> - **Theme**: Sleek light/dark mode support with soft rounded corners (`rounded-4xl`).

---

## 2. Component Tree Description

- **MemoryGame (Main Container)**: 
    - Manages top-level state transitions (`setup` -> `ready` -> `playing` -> `finished`).
    - Context provider for game logic and local storage persistence.
- **MemorySetupView (Configuration)**:
    - **Header**: Navigation and "Clear Data" actions.
    - **Matrix Configuration**: A visual multi-select or dropdown for grid dimensions (4x4, 4x5, 6x6, etc.).
    - **Team Config**: Input fields for Team Names and Color Pickers.
    - **Question Manager**:
        - List of `QuestionCard` components.
        - `AI Generate` Button to trigger `MemoryAIModal`.
        - Read-only counter: "Questions added: 10 / 10".
- **MemoryRoundView (Gameplay)**:
    - **Team Scoreboard**: Horizontal bar showing points and names.
    - **Game Grid**: Responsive CSS Grid matching the selected matrix size.
        - **MemoryCard**: 3D flip-enabled component.
    - **Footer Status**: Current turn announcement and restart button.
- **MemoryQuestionModal (Challenge)**:
    - Full-screen or centered overlay.
    - Progress bar for the 30-second timer.
    - Large Question text + 4 Choice buttons.
- **MemoryAIModal (AI Integration)**:
    - Simple input for "Topic/Subject" and "Difficulty".
    - Output area for JSON/Text import.

---

## 3. Data Structure Description

### Question Object
```typescript
interface Question {
  id: string;
  text: string;
  choices: string[]; // 4 options
  correctAnswerIndex: number;
}
```

### Card Object (Runtime)
```typescript
interface MemoryCard {
  id: string;      // Unique per card
  pairId: string;  // Shared by Question and its Answer
  content: string; // The text to display (Question or Answer)
  type: 'question' | 'answer';
  isFlipped: boolean;
  isMatched: boolean;
}
```

### Game State
```typescript
interface MemoryGameState {
  matrix: { rows: number; cols: number };
  board: MemoryCard[];
  currentPlayer: 'Team1' | 'Team2';
  scores: { Team1: number; Team2: number };
  status: 'setup' | 'playing' | 'finished';
  winner: string | null;
}
```

---

## 4. Interaction Logic

1.  **Flipping**: A player can flip maximum 2 cards at a time.
2.  **Matching**:
    - If the two flipped cards have the same `pairId` AND one is a `question`, the other is an `answer`:
        - **Trigger**: Open `MemoryQuestionModal`.
3.  **Verification**:
    - Player answers the question in the modal (30s limit).
    - **Correct**: Pairs remain visible (or disappear), score +1, player gets another turn.
    - **Wrong/Timeout**: Cards flip back to hidden, turn switches to opponent.
4.  **Completion**: When all pairs are matched, show `Trophy` and `Winner` stats.
