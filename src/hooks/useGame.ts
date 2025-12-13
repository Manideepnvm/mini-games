import { useEffect, useRef, useState, useCallback } from 'react';
import type { IGame, GameState } from '../games/GameInterface';

export const useGame = (
    game: IGame | null,
    canvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const requestRef = useRef<number | undefined>(undefined);
    const previousTimeRef = useRef<number | undefined>(undefined);

    const animate = useCallback((time: number) => {
        if (previousTimeRef.current !== undefined) {
            // time in ms
            // const deltaTime = time - previousTimeRef.current;

            if (game && game.update && gameState) {
                // Update logic if needed
            }

            const canvas = canvasRef.current;
            if (game && canvas && gameState) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = '#0f172a';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    game.render(ctx, gameState, canvas.width, canvas.height);
                }
            }
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    }, [game, gameState, canvasRef]);

    useEffect(() => {
        if (game) {
            const initialState = game.init();
            setGameState(initialState);
            previousTimeRef.current = undefined;
            requestRef.current = requestAnimationFrame(animate);
        } else {
            setGameState(null);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [game, animate]);

    const handleInput = (type: 'click' | 'keydown' | 'mousemove', event: any) => {
        const canvas = canvasRef.current;
        if (!game || !gameState || !canvas) return;

        let newState = gameState; // Don't clone yet, let the game decide if it returns a new state

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        if (type === 'click' && game.handleClick) {
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            newState = game.handleClick(x * scaleX, y * scaleY, newState, canvas.width, canvas.height);
        } else if (type === 'mousemove' && game.handleMouseMove) {
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            newState = game.handleMouseMove(x * scaleX, y * scaleY, newState, canvas.width, canvas.height);
        }

        if (newState !== gameState) {
            setGameState(newState);
        }
    };

    return {
        gameState,
        handleInput,
        resetGame: () => {
            if (game) setGameState(game.init());
        }
    };
};
