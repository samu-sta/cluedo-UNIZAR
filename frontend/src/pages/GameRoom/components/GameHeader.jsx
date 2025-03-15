import './styles/GameHeader.css';

const GameHeader = ({ gameId, gameState }) => {
  return (
    <header className="game-header">
      <h1>
        Partida: {gameId}
        <span className={`status-badge ${gameState === 'playing' ? 'playing' : 'waiting'}`}>
          {gameState === 'playing' ? 'En juego' : 'En espera'}
        </span>
      </h1>
      <p>
        {gameState === 'countdown' ?
          'La partida comenzará pronto...' :
          'Esperando a que todos los jugadores estén listos'}
      </p>
    </header>
  )
}

export default GameHeader;