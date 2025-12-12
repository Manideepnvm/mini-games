import React from 'react';
import { games } from '../games';

interface MenuProps {
    onSelectGame: (gameId: string) => void;
}

export const Menu: React.FC<MenuProps> = ({ onSelectGame }) => {
    return (
        <div className="animate-fade-in">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                    Choose Your Arena
                </h2>
                <p className="text-slate-400">Select a game to challenge your friends</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Dynamic Games List */}
                {games.map(game => (
                    <div
                        key={game.id}
                        onClick={() => onSelectGame(game.id)}
                        className="group relative bg-surface p-6 rounded-2xl border border-slate-700 hover:border-primary transition-all cursor-pointer hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1"
                    >
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            {game.icon || '🎮'}
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">
                            {game.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-4">
                            {game.description || 'No description available.'}
                        </p>
                        <div className="flex items-center text-xs text-slate-500 font-medium">
                            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">
                                {game.minPlayers === game.maxPlayers ? `${game.minPlayers} Players` : `${game.minPlayers}-${game.maxPlayers} Players`}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Coming Soon placeholders - excluding implemented games */}
                {['Battleship', 'Checkers'].map(title => (
                    <div key={title} className="opacity-50 grayscale cursor-not-allowed bg-surface p-6 rounded-2xl border border-slate-800">
                        <div className="text-4xl mb-4 opacity-50">🔒</div>
                        <h3 className="text-xl font-bold mb-2 text-slate-500">{title}</h3>
                        <p className="text-xs text-slate-600">Coming Soon</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
