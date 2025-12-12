import type { IGame, GameState } from './GameInterface';

// Define the specific state for this game
interface RPSState extends GameState {
    stage: 'p1_turn' | 'p2_turn' | 'result';
    p1Choice: string | null;
    p2Choice: string | null;
    resultMessage: string;
}

const BUTTON_WIDTH = 120;
const BUTTON_HEIGHT = 50;
const GAP = 20;

export const RockPaperScissors: IGame = {
    id: 'rockpaperscissors',
    title: 'Rock Paper Scissors',
    minPlayers: 2,
    maxPlayers: 2,

    init(): RPSState {
        return {
            score: [0, 0],
            gameOver: false,
            winner: null,
            stage: 'p1_turn',
            p1Choice: null,
            p2Choice: null,
            resultMessage: ''
        };
    },

    render(ctx: CanvasRenderingContext2D, state: GameState, width: number, height: number) {
        const rState = state as RPSState;

        // Draw Title
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#38bdf8'; // sky-400
        ctx.font = 'bold 32px Inter, sans-serif';
        ctx.fillText('Rock Paper Scissors', width / 2, 60);

        if (rState.stage === 'result') {
            drawResults(ctx, rState, width, height);
        } else {
            drawGameLoop(ctx, rState, width, height);
        }
    },

    handleClick(x: number, y: number, state: GameState, width: number, height: number): GameState {
        const rState = state as RPSState;

        // If game over/result, click to restart is handled by container, 
        // but waiting a bit and auto-restart was legacy behavior. 
        // Here we might just let GameContainer's "Play Again" handle it, or we handle input.
        if (rState.stage === 'result') return state;

        const buttonsY = height / 2;
        const totalWidth = 3 * BUTTON_WIDTH + 2 * GAP;
        const startX = (width - totalWidth) / 2;

        const choices = ['Rock', 'Paper', 'Scissors'];

        for (let i = 0; i < choices.length; i++) {
            const btnX = startX + i * (BUTTON_WIDTH + GAP);
            if (
                x >= btnX &&
                x <= btnX + BUTTON_WIDTH &&
                y >= buttonsY &&
                y <= buttonsY + BUTTON_HEIGHT
            ) {
                return handleChoice(choices[i].toLowerCase(), rState);
            }
        }

        return state;
    }
};

function drawGameLoop(ctx: CanvasRenderingContext2D, state: RPSState, width: number, height: number) {
    // Instruction
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Inter, sans-serif';
    ctx.fillText(
        state.stage === 'p1_turn' ? "Player 1's Turn" : "Player 2's Turn",
        width / 2,
        140
    );

    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText("Choose your weapon:", width / 2, 180);

    // Buttons
    const choices = ['Rock', 'Paper', 'Scissors'];
    const buttonsY = height / 2;
    const totalWidth = 3 * BUTTON_WIDTH + 2 * GAP;
    const startX = (width - totalWidth) / 2;

    choices.forEach((choice, i) => {
        const x = startX + i * (BUTTON_WIDTH + GAP);
        const y = buttonsY;

        // Button bg
        ctx.fillStyle = '#1e293b'; // slate-800
        ctx.fillRect(x, y, BUTTON_WIDTH, BUTTON_HEIGHT);

        // Border
        ctx.strokeStyle = '#38bdf8'; // sky-400
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, BUTTON_WIDTH, BUTTON_HEIGHT);

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.fillText(choice, x + BUTTON_WIDTH / 2, y + BUTTON_HEIGHT / 2);
    });
}

function drawResults(ctx: CanvasRenderingContext2D, state: RPSState, width: number, height: number) {
    const p1 = capitalize(state.p1Choice || '');
    const p2 = capitalize(state.p2Choice || '');

    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Inter, sans-serif';
    ctx.fillText(`Player 1 chose: ${p1}`, width / 2, 150);
    ctx.fillText(`Player 2 chose: ${p2}`, width / 2, 200);

    ctx.font = 'bold 36px Inter, sans-serif';
    if (state.winner === 0) ctx.fillStyle = '#4ade80'; // green
    else if (state.winner === 1) ctx.fillStyle = '#f87171'; // red (from P1 perspective, P2 is opponent) -- wait, purely visual colors
    else ctx.fillStyle = '#fbbf24'; // amber (draw)

    ctx.fillText(state.resultMessage, width / 2, 300);
}

function handleChoice(choice: string, state: RPSState): RPSState {
    if (state.stage === 'p1_turn') {
        return {
            ...state,
            stage: 'p2_turn',
            p1Choice: choice
        };
    } else {
        // P2 chose, determine winner
        const p1 = state.p1Choice!;
        const p2 = choice;
        const winner = determineWinner(p1, p2);

        let newScore = [...state.score];
        let message = '';
        let winnerIndex: number | null = null;
        let isDraw = false;

        if (winner === 'draw') {
            message = "It's a Draw!";
            isDraw = true;
        } else if (winner === 1) {
            message = "Player 1 Wins!";
            newScore[0]++;
            winnerIndex = 0;
        } else {
            message = "Player 2 Wins!";
            newScore[1]++;
            winnerIndex = 1;
        }

        return {
            ...state,
            stage: 'result',
            p2Choice: choice,
            score: newScore,
            gameOver: true, // waiting for "Play Again" click from Container UI
            winner: winnerIndex,
            isDraw,
            resultMessage: message
        };
    }
}

function determineWinner(p1: string, p2: string): 1 | 2 | 'draw' {
    if (p1 === p2) return 'draw';
    if (
        (p1 === 'rock' && p2 === 'scissors') ||
        (p1 === 'scissors' && p2 === 'paper') ||
        (p1 === 'paper' && p2 === 'rock')
    ) {
        return 1;
    }
    return 2;
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
