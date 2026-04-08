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
  text: string;  // Modal Question Text
  choices: string[];
  correctAnswerIndex: number;
}

export interface MemoryCard {
  id: string;      // Unique per card (index-based)
  pairId: string;  // Shared by Question and its Answer
  content: string; // The text to display (Question or Answer)
  type: 'question' | 'answer';
  isFlipped: boolean;
  isMatched: boolean;
}

export type GameEffect = 'tick' | 'switch-alarm' | 'wrong-answer' | 'match-success';

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
  questionTime: number;
}

export class MemoryGameLogic {
  private matrix = { rows: 4, cols: 5 };
  private board: MemoryCard[] = [];
  private currentPlayer: Player = 'Team1';
  private questions: Question[] = [];
  private scores = { Team1: 0, Team2: 0 };
  private status: 'setup' | 'ready' | 'playing' | 'finished' = 'setup';
  private questionTime: number = 15;

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
      questionTime: this.questionTime,
    };
  }

  setQuestionTime(time: number) {
    this.questionTime = time;
  }

  setQuestions(questions: Question[]) {
    this.questions = questions;
  }

  setMatrix(rows: number, cols: number) {
    this.matrix = { rows, cols };
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

    let cards: MemoryCard[] = [];
    selectedQuestions.forEach((q) => {
      // Question Card (Pair A)
      cards.push({
        id: `q-${q.id}`,
        pairId: q.id,
        content: q.pairA || q.text,
        type: 'question',
        isFlipped: false,
        isMatched: false,
      });
      // Answer Card (Pair B)
      cards.push({
        id: `a-${q.id}`,
        pairId: q.id,
        content: q.pairB || q.choices[q.correctAnswerIndex],
        type: 'answer',
        isFlipped: false,
        isMatched: false,
      });
    });

    this.board = this.shuffle(cards);
  }

  private shuffle(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
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
   * Returns the question if it's a match and requires verification.
   */
  checkMatch(): { question: Question, pairId: string } | null {
    const flipped = this.board.filter(c => c.isFlipped && !c.isMatched);
    if (flipped.length !== 2) return null;

    if (flipped[0].pairId === flipped[1].pairId) {
      // It's a match!
      const question = this.questions.find(q => q.id === flipped[0].pairId);
      if (question) {
        return { question, pairId: flipped[0].pairId };
      }
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

      // Match found: turn continues?
      // "Correct Answer -> Player gets the pair, points, and possibly another turn."
      // Let's allow another turn for now.
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
      currentPlayer: this.currentPlayer,
      questionTime: this.questionTime
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
    if (data.questionTime) logic.questionTime = data.questionTime;
    return logic;
  }
}
