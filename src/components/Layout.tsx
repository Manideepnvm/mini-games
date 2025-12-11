import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-white flex flex-col font-sans">
            <header className="p-6 border-b border-surface bg-surface/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            🎮 Mini Multiplayer Games
                        </h1>
                        <p className="text-sm text-slate-400">Play with friends locally!</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 container max-w-4xl mx-auto p-6">
                {children}
            </main>

            <footer className="p-6 text-center text-slate-500 text-sm border-t border-surface mt-auto">
                <p>Built with ❤️ for multiplayer fun</p>
            </footer>
        </div>
    );
};
