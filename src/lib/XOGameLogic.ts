/**
 * XOGameLogic.ts
 * Core logic for the XO Classroom Game.
 * Separates game state management from React UI.
 */

export type Team = 'green' | 'blue';
export type Player = 'X' | 'O';
export type CellValue = Player | null;

export type TeamColor = 'red' | 'emerald' | 'sky' | 'purple' | 'yellow' | 'orange' | 'green' | 'blue';

export interface Question {
  id: string;
  text: string;
  choices: string[];
  correctAnswerIndex: number;
  timeLimit?: number; // per-question timer
}

export type GameEffect = 'tick' | 'switch-alarm' | 'wrong-answer';

export interface GameState {
  board: CellValue[];
  currentPlayer: Player;
  greenTimer: number;
  blueTimer: number;
  initialTimerValue: number; // For identifying if it's "muted"/unset
  answeredQuestionIds: Set<string>;
  winner: Player | 'Draw' | null;
  status: 'setup' | 'ready' | 'playing' | 'finished';
  greenTeamName: string;
  blueTeamName: string;
  greenTeamColor: TeamColor;
  blueTeamColor: TeamColor;
  perQuestionTimer: number;
}

export class XOGameLogic {
  private board: CellValue[] = Array(9).fill(null);
  private currentPlayer: Player = 'X';
  private questions: Question[] = [];
  private answeredQuestionIds: Set<string> = new Set();
  private greenTimer: number = 0;
  private blueTimer: number = 0;
  private initialTimerValue: number = 0;
  private winner: Player | 'Draw' | null = null;
  private status: 'setup' | 'ready' | 'playing' | 'finished' = 'setup';
  private greenTeamName: string = "الفريق الأخضر";
  private blueTeamName: string = "الفريق الأزرق";
  private greenTeamColor: TeamColor = 'emerald';
  private blueTeamColor: TeamColor = 'sky';
  private perQuestionTimer: number = 60;

  // Callback for UI sound effects
  public onEffect?: (effect: GameEffect) => void;

  constructor(questions?: Question[] /*, timers?: { green: number; blue: number }*/) {
    if (questions) this.questions = questions;
    /* maybe a dead code
    if (timers) {
      this.greenTimer = timers.green;
      this.blueTimer = timers.blue;
      this.initialTimerValue = Math.max(timers.green, timers.blue);
    }
    */
  }

  // --- State Accessors ---

  getState(): GameState {
    return {
      board: [...this.board],
      currentPlayer: this.currentPlayer,
      greenTimer: this.greenTimer,
      blueTimer: this.blueTimer,
      initialTimerValue: this.initialTimerValue,
      answeredQuestionIds: new Set(this.answeredQuestionIds),
      winner: this.winner,
      status: this.status,
      greenTeamName: this.greenTeamName,
      blueTeamName: this.blueTeamName,
      greenTeamColor: this.greenTeamColor,
      blueTeamColor: this.blueTeamColor,
      perQuestionTimer: this.perQuestionTimer,
    };
  }

  getQuestions() {
    return [...this.questions];
  }

  // --- Game Actions ---

  setQuestions(questions: Question[]) {
    this.questions = questions;
  }

  // maybe a dead code
  /*
  setTimers(green: number, blue: number) {
    this.greenTimer = green;
    this.blueTimer = blue;
    this.initialTimerValue = Math.max(green, blue);
  }
  */

  setTeamInfo(greenName: string, blueName: string, greenColor: TeamColor, blueColor: TeamColor) {
    this.greenTeamName = greenName;
    this.blueTeamName = blueName;
    this.greenTeamColor = greenColor;
    this.blueTeamColor = blueColor;
  }

  setPerQuestionTimer(seconds: number) {
    this.perQuestionTimer = seconds;
  }

  prepareGame() {
    this.status = 'ready';
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.answeredQuestionIds.clear();
    this.winner = null;
  }

  startGame() {
    this.status = 'playing';
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.answeredQuestionIds.clear();
    this.winner = null;
    // Reset timers to their initial set values if they exist
    /* maybe a dead code
    if (this.initialTimerValue > 0) {
      this.greenTimer = this.initialTimerValue;
      this.blueTimer = this.initialTimerValue;
    }
    */
  }

  /**
   * Called when a teacher clicks a box (1-9).
   * Returns a question if available.
   */
  selectBox(index: number): Question | null {
    if (this.board[index] || this.status !== 'playing') return null;

    // Pick an unanswered question
    const availableQuestions = this.questions.filter(q => !this.answeredQuestionIds.has(q.id));
    if (availableQuestions.length === 0) return null;

    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  }

  /**
   * handleAnswer
   * If correct, the box is taken by currentPlayer and we switch players.
   */
  handleAnswer(index: number, isCorrect: boolean, questionId: string) {
    if (isCorrect) {
      this.board[index] = this.currentPlayer;
      this.answeredQuestionIds.add(questionId);
      this.checkWinner();
      // Dispatch correct answer sound
      if (this.onEffect) this.onEffect('switch-alarm');
    } else {
      // Dispatch wrong answer sound
      if (this.onEffect) this.onEffect('wrong-answer');
    }

    // Always switch player after an attempt
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  private checkWinner() {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diags
    ];

    for (const [a, b, c] of lines) {
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        this.winner = this.board[a] as Player;
        this.status = 'finished';
        return;
      }
    }

    if (this.board.every(cell => cell !== null)) {
      this.winner = 'Draw';
      this.status = 'finished';
    }
  }

  // maybe a dead code
  /*
  updateTimer(team: Team, seconds: number) {
    if (this.initialTimerValue === 0 || this.status !== 'playing') return; // Muted mode or over

    if (team === 'green') {
      this.greenTimer = Math.max(0, this.greenTimer - seconds);
      if (this.greenTimer <= 0) {
        this.winner = 'O'; // Green (X) loses if timer hits 0
        this.status = 'finished';
      }
    } else {
      this.blueTimer = Math.max(0, this.blueTimer - seconds);
      if (this.blueTimer <= 0) {
        this.winner = 'X'; // Blue (O) loses if timer hits 0
        this.status = 'finished';
      }
    }

    // Dispatch tick sound
    if (this.onEffect) this.onEffect('tick');
  }
  */

  // --- Import/Export Helpers ---

  toJSON() {
    return {
      questions: this.questions,
      timers: { green: this.greenTimer, blue: this.blueTimer, initial: this.initialTimerValue },
      names: { green: this.greenTeamName, blue: this.blueTeamName },
      colors: { green: this.greenTeamColor, blue: this.blueTeamColor },
      perQuestionTimer: this.perQuestionTimer
    };
  }

  static fromJSON(data: any): XOGameLogic {
    const logic = new XOGameLogic(data.questions /*, data.timers*/);
    /* maybe a dead code
    if (data.timers?.initial) {
      logic.setTimers(data.timers.initial, data.timers.initial);
    }
    */
    if (data.names) {
      logic.setTeamInfo(
        data.names.green || "الفريق الأخضر",
        data.names.blue || "الفريق الأزرق",
        data.colors?.green || 'emerald',
        data.colors?.blue || 'sky'
      );
    }
    if (data.perQuestionTimer) {
      logic.setPerQuestionTimer(data.perQuestionTimer);
    }
    return logic;
  }
}
