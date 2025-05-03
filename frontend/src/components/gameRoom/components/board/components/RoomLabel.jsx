/**
 * @fileoverview Componente que muestra el nombre de una habitación en el tablero
 * @author Samuel Felipe
 */
import '../styles/RoomLabel.css';

const RoomLabel = ({ room }) => {
  const walls = room.walls;
  const minRow = Math.min(...walls.map(w => w.row));
  const maxRow = Math.max(...walls.map(w => w.row));
  const minCol = Math.min(...walls.map(w => w.column));
  const maxCol = Math.max(...walls.map(w => w.column));
  const centerRow = Math.floor((minRow + maxRow) / 2);
  const centerCol = Math.floor((minCol + maxCol) / 2);

  return (
    <h3
      className="room-label"
      style={{
        gridRow: centerRow,
        gridColumn: centerCol
      }}
    >
      {room.name}
    </h3>
  );
};

export default RoomLabel;