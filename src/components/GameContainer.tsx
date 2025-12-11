import React, { useRef, useEffect } from 'react';
import type { IGame } from '../games/GameInterface';
import { useGame } from '../hooks/useGame';

interface GameContainerProps {
    game: IGame;
    onBack: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({ game, onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { gameState, handleInput, resetGame } = useGame(game, canvasRef);

    useEffect(() => {
        // Focus canvas for keyboard events if needed
    }, []);

    return (
        <div className="flex flex-col items-center animate-fade-in">
            <div className="w-full flex justify-between items-center mb-4">
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-surface hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
                >
                    ← Back to Menu
                </button>
                <div className="flex gap-4">
                    <div className="bg-surface px-4 py-2 rounded-lg border border-slate-700">
                        <span className="text-slate-400 text-xs uppercase tracking-wider">Score</span>
                        <div className="font-mono text-xl text-primary font-bold">
                            {gameState?.score[0] || 0} - {gameState?.score[1] || 0}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative group">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 cursor-pointer"
                    onClick={(e) => handleInput('click', e)}
                />

                {/* Overlay for Game Over */}
                {gameState?.gameOver && (
                    <div className="absolute inset-0 bg-black/60 rounded-xl backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-surface p-8 rounded-2xl border border-slate-700 shadow-2xl text-center transform animate-bounce-short">
                            <h2 className="text-3xl font-bold mb-2">
                                {gameState.isDraw ? "It's a Draw!" : `Player ${gameState.winner === 0 ? '1' : '2'} Wins!`}
                            </h2>
                            <div className="flex gap-4 justify-center mt-6">
                                <button
                                    onClick={resetGame}
                                    className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-all hover:scale-105"
                                >
                                    Play Again
                                </button>
                                <button
                                    onClick={onBack}
                                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                                >
                                    Exit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-surface/50 rounded-lg max-w-2xl text-center text-slate-400 text-sm">
                Click to interact. Use mouse or touch controls.
            </div>
        </div>
    );
};
