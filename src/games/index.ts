import type { IGame } from './GameInterface';
import { TicTacToe } from './TicTacToe';

export const games: IGame[] = [
    TicTacToe,
];

export const getGameById = (id: string): IGame | undefined => {
    return games.find(g => g.id === id);
};
