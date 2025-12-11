import type { IGame, GameState } from './GameInterface';

interface TicTacToeState extends GameState {
    board: string[][];
    currentPlayer: number;
}

export const TicTacToe: IGame = {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    minPlayers: 2,
    maxPlayers: 2,

    init(): TicTacToeState {
        return {
            score: [0, 0],
            gameOver: false,
            winner: null,
            isDraw: false,
            board: [
                ['', '', ''],
                ['', '', ''],
                ['', '', '']
            ],
            currentPlayer: 0
        };
    },

    render(ctx: CanvasRenderingContext2D, state: GameState, width: number, height: number) {
        const tState = state as TicTacToeState;
        const cellW = width / 3;
        const cellH = height / 3;

        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        for (let i = 1; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellW, 20);
            ctx.lineTo(i * cellW, height - 20);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(20, i * cellH);
            ctx.lineTo(width - 20, i * cellH);
            ctx.stroke();
        }

        tState.board.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (!cell) return;
                const x = c * cellW + cellW / 2;
                const y = r * cellH + cellH / 2;
                const size = Math.min(cellW, cellH) / 3;
                ctx.lineWidth = 6;
                if (cell === 'X') {
                    ctx.strokeStyle = '#f43f5e';
                    ctx.beginPath();
                    ctx.moveTo(x - size, y - size);
                    ctx.lineTo(x + size, y + size);
                    ctx.moveTo(x + size, y - size);
                    ctx.lineTo(x - size, y + size);
                    ctx.stroke();
                } else {
                    ctx.strokeStyle = '#22c55e';
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.stroke();
                }
            });
        });
    },

    handleClick(x: number, y: number, state: GameState, width: number, height: number): GameState {
        if (state.gameOver) return state;

        const tState = state as TicTacToeState;
        const cellW = width / 3;
        const cellH = height / 3;

        const col = Math.floor(x / cellW);
        const row = Math.floor(y / cellH);

        if (row < 0 || row > 2 || col < 0 || col > 2) return state;
        if (tState.board[row][col]) return state;

        const newBoard = tState.board.map(r => [...r]);
        newBoard[row][col] = tState.currentPlayer === 0 ? 'X' : 'O';

        const newState: TicTacToeState = {
            ...tState,
            board: newBoard,
            currentPlayer: tState.currentPlayer === 0 ? 1 : 0
        };

        const winner = checkWin(newBoard);
        if (winner) {
            newState.gameOver = true;
            newState.winner = winner === 'X' ? 0 : 1;
            newState.score = [...tState.score];
            newState.score[newState.winner]++;
        } else if (checkDraw(newBoard)) {
            newState.gameOver = true;
            newState.isDraw = true;
        }

        return newState;
    }
};

function checkWin(board: string[][]): string | null {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) return board[i][0];
    }
    for (let i = 0; i < 3; i++) {
        if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) return board[0][i];
    }
    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) return board[0][0];
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) return board[0][2];
    return null;
}

function checkDraw(board: string[][]): boolean {
    return board.every(row => row.every(cell => cell !== ''));
}
