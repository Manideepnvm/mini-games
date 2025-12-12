import { useState } from 'react';
import { Layout } from './components/Layout';
import { Menu } from './components/Menu';
import { GameContainer } from './components/GameContainer';
import { getGameById } from './games';


function App() {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const activeGame = activeGameId ? getGameById(activeGameId) : null;

  return (
    <Layout>
      {activeGame ? (
        <GameContainer
          game={activeGame}
          onBack={() => setActiveGameId(null)}
        />
      ) : (
        <Menu onSelectGame={setActiveGameId} />
      )}
    </Layout>
  );
}

export default App;
