import './styles/CharacterBadge.css';

const CharacterBadge = ({ character }) => {
  if (!character) return null;

  const characterName = character.name;
  const characterBackground = character.colorHex || '#000000';
  const characterTextColor = character.textColorHex || '#ffffff';

  return (
    <article
      className="character-badge"
      style={{
        backgroundColor: characterBackground,
        color: characterTextColor
      }}
    >
      {characterName}
    </article>
  );
};

export default CharacterBadge;