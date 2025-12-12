import type { IGame } from './GameInterface';
import { TicTacToe } from './TicTacToe';
import { RockPaperScissors } from './RockPaperScissors';

export const games: IGame[] = [
    TicTacToe,
    RockPaperScissors,
];

export const getGameById = (id: string): IGame | undefined => {
    return games.find(g => g.id === id);
};
