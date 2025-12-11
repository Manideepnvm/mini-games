import type { KeyboardEvent, MouseEvent } from 'react';

export interface GameState {
  score: number[];
  gameOver: boolean;
  winner: number | null;
  isDraw?: boolean;
}

export interface IGame {
  id: string;
  title: string;
  minPlayers: number;
  maxPlayers: number;

  init(): GameState;

  render(
    ctx: CanvasRenderingContext2D,
    state: GameState,
    width: number,
    height: number
  ): void;

  handleClick?(
    x: number,
    y: number,
    state: GameState,
    width: number,
    height: number
  ): GameState;

  handleKeyDown?(
    key: string,
    state: GameState
  ): GameState;

  update?(
    deltaTime: number,
    state: GameState
  ): GameState;
}

// Ensure unused imports are removed or used. 
// KeyboardEvent and MouseEvent are types from react.
export type { KeyboardEvent, MouseEvent };
