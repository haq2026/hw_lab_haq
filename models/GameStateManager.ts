import { Constants } from './Constants';

// Singleton that keeps level, score and lives alive across screen changes
// (Game -> LevelComplete -> Game).
class GameStateManager {
  private static _instance: GameStateManager | null = null;

  private _currentLevel = 1;
  private _score = 0;
  private _lives: number = Constants.Player.startingLives;

  // Private so nobody else can make a second instance.
  private constructor() {}

  // Returns the one shared instance, creating it the first time.
  static get instance(): GameStateManager {
    if (!this._instance) this._instance = new GameStateManager();
    return this._instance;
  }

  // Read-only access to the current level.
  get currentLevel() { return this._currentLevel; }
  // Read-only access to the score.
  get score() { return this._score; }
  // Read-only access to the remaining lives.
  get lives() { return this._lives; }

  // Moves on to the next level.
  advanceToNextLevel() { this._currentLevel += 1; }
  // Goes back to level 1 without touching score or lives.
  resetLevel() { this._currentLevel = 1; }
  // True once the player has gone past the last level.
  isMaxLevelReached() { return this._currentLevel > Constants.Game.maxLevels; }

  // Adds points to the score.
  addScore(points: number) { this._score += points; }
  // Takes away one life and returns how many are left.
  loseLife(): number { this._lives -= 1; return this._lives; }

  // Puts level, score and lives back to the starting values.
  resetGame() {
    this._currentLevel = 1;
    this._score = 0;
    this._lives = Constants.Player.startingLives;
  }
}

export default GameStateManager;
