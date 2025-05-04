import React from 'react';
import '../styles/PlayerToken.css';

const PlayerToken = ({ player }) => {
  const { character, username } = player;
  const { name, colorHex, textColorHex } = character;

  const backgroundColor = colorHex || '#888888';
  const textColorValue = textColorHex || '#FFFFFF';

  const getInitials = (name) => {
    if (!name) return '?';

    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <figure
      className="player-token"
      style={{
        backgroundColor,
        color: textColorValue
      }}
      title={`${username} (${name})`}
    >
      <span className="player-token-text">{getInitials(name)}</span>
    </figure>
  );
};

export default PlayerToken;