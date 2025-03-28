import '../styles/BoardCell.css';
import PlayerToken from './PlayerToken';

const BoardCell = ({ row, column, boardData, players }) => {
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
    roomInfo ? `room-${roomInfo.name.toLowerCase().replace(/\s+/g, '-')}` : ''
  ].filter(Boolean).join(' ');

  return (
    <button className={cellClasses}>
      {players &&
        players.map(player => {
          if (player.position.row === row && player.position.column === column) {
            return <PlayerToken key={player.character} player={player} />;
          }
          return null;
        })
      }
    </button>
  );
};

export default BoardCell;