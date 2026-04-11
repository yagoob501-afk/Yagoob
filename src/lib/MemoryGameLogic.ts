/**
 * MemoryGameLogic.ts
 * Core logic for the Memory Strong Classroom Game.
 * Based on "The Cognitive Prism" design system and XO game features.
 */

export type Team = 'green' | 'blue';
export type Player = 'Team1' | 'Team2'; // Emerald vs Sky
export type TeamColor = 'emerald' | 'sky';

export interface Question {
  id: string;
  pairA: string; // Text for Card 1
  pairB: string; // Text for Card 2
}

export interface MemoryCard {
  id: string;      // Unique per card (index-based)
  pairId: string;  // Shared by Question and its Answer
  content: string; // The text to display (Question or Answer)
  type: 'question' | 'answer';
  isFlipped: boolean;
  isMatched: boolean;
}

export type GameEffect = 'switch-alarm' | 'wrong-answer' | 'match-success' | 'tick';

export interface MemoryGameState {
  matrix: { rows: number; cols: number };
  board: MemoryCard[];
  currentPlayer: Player;
  scores: { Team1: number; Team2: number };
  questions: Question[];
  status: 'setup' | 'ready' | 'playing' | 'finished';
  winner: Player | 'Draw' | null;
  greenTeamName: string;
  blueTeamName: string;
  greenTeamColor: TeamColor;
  blueTeamColor: TeamColor;
}

export class MemoryGameLogic {
  private matrix = { rows: 2, cols: 4 };
  private board: MemoryCard[] = [];
  private currentPlayer: Player = 'Team1';
  private questions: Question[] = [];
  private scores = { Team1: 0, Team2: 0 };
  private status: 'setup' | 'ready' | 'playing' | 'finished' = 'setup';

  private greenTeamName: string = "الفريق الأول";
  private blueTeamName: string = "الفريق الثاني";
  private greenTeamColor: TeamColor = 'emerald';
  private blueTeamColor: TeamColor = 'sky';

  public onEffect?: (effect: GameEffect) => void;

  constructor(questions?: Question[], matrix?: { rows: number; cols: number }) {
    if (questions) this.questions = questions;
    if (matrix) this.matrix = matrix;
  }

  // --- State Accessors ---

  getState(): MemoryGameState {
    return {
      matrix: { ...this.matrix },
      board: [...this.board],
      currentPlayer: this.currentPlayer,
      scores: { ...this.scores },
      questions: [...this.questions],
      status: this.status,
      winner: this.calculateWinner(),
      greenTeamName: this.greenTeamName,
      blueTeamName: this.blueTeamName,
      greenTeamColor: this.greenTeamColor,
      blueTeamColor: this.blueTeamColor,
    };
  }

  setQuestions(questions: Question[]) {
    this.questions = questions;
  }

  setMatrixByCount(count: number) {
    if (count === 4) this.matrix = { rows: 2, cols: 4 };
    else if (count === 6) this.matrix = { rows: 4, cols: 3 };
    else if (count === 8) this.matrix = { rows: 4, cols: 4 };
    else if (count === 10) this.matrix = { rows: 4, cols: 5 };
    else {
      // Default fallback
      this.matrix = { rows: 4, cols: Math.ceil(count / 2) };
    }
  }

  setTeamInfo(greenName: string, blueName: string, greenColor: TeamColor, blueColor: TeamColor) {
    this.greenTeamName = greenName;
    this.blueTeamName = blueName;
    this.greenTeamColor = greenColor;
    this.blueTeamColor = blueColor;
  }

  prepareGame() {
    this.status = 'ready';
    this.resetBoard();
  }

  startGame() {
    this.status = 'playing';
    this.resetBoard();
    this.currentPlayer = 'Team1';
    this.scores = { Team1: 0, Team2: 0 };
  }

  private resetBoard() {
    const totalCells = this.matrix.rows * this.matrix.cols;
    const pairCount = Math.floor(totalCells / 2);

    // Use only the required number of questions
    const selectedQuestions = this.questions.slice(0, pairCount);

    let questionsSet: MemoryCard[] = [];
    let answersSet: MemoryCard[] = [];

    selectedQuestions.forEach((q) => {
      // Question Card (Pair A)
      questionsSet.push({
        id: `q-${q.id}`,
        pairId: q.id,
        content: q.pairA,
        type: 'question',
        isFlipped: false,
        isMatched: false,
      });
      // Answer Card (Pair B)
      answersSet.push({
        id: `a-${q.id}`,
        pairId: q.id,
        content: q.pairB,
        type: 'answer',
        isFlipped: false,
        isMatched: false,
      });
    });

    // Partitioned Board: Questions at top, Answers at bottom
    // We shuffle each set independently if possible, or just keep them as is and shuffle their positions.
    // The user wants questions at top and answers at bottom.
    // So we shuffle the questions set and put it in first half, and shuffle answers set and put it in second half.
    
    this.board = [...this.shuffle(questionsSet), ...this.shuffle(answersSet)];
  }

  private shuffle(array: any[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Called when a player clicks a card.
   * Logic: can only flip up to 2 cards.
   */
  flipCard(id: string) {
    if (this.status !== 'playing') return;

    const flippedCount = this.board.filter(c => c.isFlipped && !c.isMatched).length;
    if (flippedCount >= 2) return;

    const card = this.board.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    card.isFlipped = true;

    if (this.onEffect) this.onEffect('tick');
  }

  /**
   * Check if the two flipped cards match.
   * Returns the question if it's a match.
   */
  checkMatch(): { pairId: string } | null {
    const flipped = this.board.filter(c => c.isFlipped && !c.isMatched);
    if (flipped.length !== 2) return null;

    if (flipped[0].pairId === flipped[1].pairId) {
      // It's a match!
      return { pairId: flipped[0].pairId };
    }
    return null;
  }

  /**
   * Finalize the turn after match check or answer.
   */
  handleAnswer(isCorrect: boolean, pairId?: string) {
    const flipped = this.board.filter(c => c.isFlipped && !c.isMatched);

    if (isCorrect && pairId) {
      flipped.forEach(c => {
        if (c.pairId === pairId) {
          c.isMatched = true;
          c.isFlipped = true; // Ensure they stay flipped
        }
      });
      // Increment score for current player
      if (this.currentPlayer === 'Team1') this.scores.Team1++;
      else this.scores.Team2++;

      if (this.onEffect) this.onEffect('match-success');

      // Check if board finished
      if (this.board.every(c => c.isMatched)) {
        this.status = 'finished';
      }
    } else {
      // Wrong answer or no match
      if (this.onEffect) this.onEffect('wrong-answer');

      // Flip back and switch turns
      this.board.filter(c => c.isFlipped && !c.isMatched).forEach(c => c.isFlipped = false);
      this.currentPlayer = this.currentPlayer === 'Team1' ? 'Team2' : 'Team1';
    }
  }

  private calculateWinner(): Player | 'Draw' | null {
    if (this.status !== 'finished') return null;
    if (this.scores.Team1 > this.scores.Team2) return 'Team1';
    if (this.scores.Team2 > this.scores.Team1) return 'Team2';
    return 'Draw';
  }

  toJSON() {
    return {
      questions: this.questions,
      matrix: this.matrix,
      names: { green: this.greenTeamName, blue: this.blueTeamName },
      colors: { green: this.greenTeamColor, blue: this.blueTeamColor },
      scores: this.scores,
      currentPlayer: this.currentPlayer
    };
  }

  static fromJSON(data: any): MemoryGameLogic {
    const logic = new MemoryGameLogic(data.questions, data.matrix);
    if (data.names) {
      logic.setTeamInfo(
        data.names.green || "الفريق الأول",
        data.names.blue || "الفريق الثاني",
        data.colors?.green || 'emerald',
        data.colors?.blue || 'sky'
      );
    }
    if (data.scores) logic.scores = data.scores;
    if (data.currentPlayer) logic.currentPlayer = data.currentPlayer;
    return logic;
  }
}
