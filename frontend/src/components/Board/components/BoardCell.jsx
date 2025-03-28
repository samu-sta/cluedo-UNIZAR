import '../styles/BoardCell.css';
import PlayerToken from './PlayerToken';

const BoardCell = ({ row, column, boardData, players, isHighlighted, isInPath, onClick }) => {
  const isWall = boardData.rooms.some(room =>
    room.walls.some(wall => wall.row === row && wall.column === column)
  );

  const door = boardData.rooms.reduce((foundDoor, room) => {
    const doorMatch = room.doors.find(door => door.row === row && door.column === column);
    return doorMatch ? { ...doorMatch, roomName: room.name } : foundDoor;
  }, null);

  const roomInfo = boardData.rooms.find(room =>
    room.walls.some(wall => wall.row === row && wall.column === column)
  );

  const cellClasses = [
    'board-cell',
    isWall ? 'wall' : '',
    door ? 'door' : '',
    isHighlighted ? 'valid-move' : '',
    isInPath ? 'in-path' : '',
    door && isHighlighted ? 'door-valid-move' : '',
    roomInfo ? `room-${roomInfo.name.toLowerCase().replace(/\s+/g, '-')}` : ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={cellClasses}
      onClick={onClick}
    >
      {players &&
        players.map(player => {
          if (player.position && player.position.row === row && player.position.column === column) {
            return <PlayerToken key={player.id || player.username} player={player} />;
          }
          return null;
        })
      }
    </button>
  );
};

export default BoardCell;