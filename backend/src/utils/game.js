/*************************************************
 * Utilidades para gestión del juego
 * 
 * Funciones de consulta y manipulación de estados
 * del juego, incluyendo obtención de cartas, tablero
 * y verificación de acciones durante la partida.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import GameModel from "../models/Game.js";
import CardModel from "../models/Card.js";
import BoardModel from "../models/Board.js";
import RoomModel from "../models/Room.js";
import WallModel from "../models/Wall.js";
import DoorModel from "../models/Door.js";

import setupRelations from '../models/relations.js';
export const getGame = async () => {
  return await GameModel.findOne({
    attributes: {
      exclude: ['id']
    },
    include: [
      {
        model: CardModel,
        as: 'cards',
        attributes: {
          exclude: ['id', 'gameId']
        }
      },
      {
        model: BoardModel,
        as: 'board',
        attributes: {
          exclude: ['id', 'gameId']
        },
        include: [{
          model: RoomModel,
          as: 'rooms',
          attributes: {
            exclude: ['id', 'boardId']
          },
          include: [
            {
              model: WallModel,
              as: 'walls',
              attributes: {
                exclude: ['id', 'roomId']
              }
            },
            {
              model: DoorModel,
              as: 'doors',
              attributes: {
                exclude: ['id', 'roomId']
              }
            }
          ]
        }]
      }]
  });
}

export const getCards = async (gameId = 1) => {
  return await CardModel.findAll({
    where: { gameId },
    attributes: {
      exclude: ['id', 'gameId']
    },
    raw: true
  });
}

export const getBoard = async (gameId = 1) => {
  return await BoardModel.findOne({
    where: { gameId },
    attributes: {
      exclude: ['id', 'gameId']
    },
    include: [{
      model: RoomModel,
      as: 'rooms',
      attributes: {
        exclude: ['id', 'boardId']
      },
      include: [
        {
          model: WallModel,
          as: 'walls',
          attributes: {
            exclude: ['id', 'roomId']
          }
        },
        {
          model: DoorModel,
          as: 'doors',
          attributes: {
            exclude: ['id', 'roomId']
          }
        }
      ]
    }]
  });
}
export const getCharacters = async (gameId = 1) => {
  return await CardModel.findAll({
    where: { gameId, type: 'character' },
    attributes: ['name', 'colorHex', 'textColorHex'],
    raw: true
  });
}

/**
 * Distribuye cartas entre los jugadores
 * @param {Array} cards - Cartas a distribuir
 * @param {number} playerCount - Número de jugadores
 * @returns {Object} - Objeto con las cartas por jugador y las sobrantes
 */
export const distributeCards = (cards, playerIds) => {
  const shuffledCards = [...cards];
  const playerCount = playerIds.length;
  const playerCards = {};
  const leftoverCards = [];

  playerIds.forEach(playerId => {
    playerCards[playerId] = [];
  });

  const cardsPerPlayer = Math.floor(shuffledCards.length / playerCount);

  shuffledCards.forEach((card, index) => {
    if (index < cardsPerPlayer * playerCount) {
      const playerIndex = Math.floor(index / cardsPerPlayer);
      const playerId = playerIds[playerIndex];
      playerCards[playerId].push(card);
    } else {
      leftoverCards.push(card);
    }
  });

  return { playerCards, leftoverCards };
};

/**
 * Selecciona una solución aleatoria del juego
 * @param {Object} allCards - Objeto con todas las cartas por tipo
 * @returns {Object} - Solución seleccionada y cartas restantes
 */
export const selectSolution = (allCards) => {
  const character = getRandomCard(allCards.characters);
  const weapon = getRandomCard(allCards.weapons);
  const room = getRandomCard(allCards.rooms);

  const remainingCards = allCards.allCards.filter(card =>
    card.name !== character.name &&
    card.name !== weapon.name &&
    card.name !== room.name
  );

  return {
    character,
    weapon,
    room,
    remainingCards
  };
};

/**
 * Obtiene una carta aleatoria de un array de cartas
 * @param {Array} cards - Array de cartas
 * @returns {Object} - Carta seleccionada aleatoriamente
 */
export const getRandomCard = (cards) => {
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
};

/**
 * Verifica si una acusación es correcta
 * @param {Object} accusation - Acusación realizada por un jugador
 * @param {Object} solution - Solución de la partida
 * @returns {boolean} - True si es correcta, false en caso contrario
 */
export const checkAccusation = (accusation, solution) => {
  return (
    accusation.character === solution.character.name &&
    accusation.weapon === solution.weapon.name &&
    accusation.room === solution.room.name
  );
};

/**
 * Determina si una posición está dentro de una habitación
 * @param {Object} room - Habitación a comprobar
 * @param {Object} position - Posición a comprobar
 * @returns {boolean} - True si la posición está dentro de la habitación
 */
export const isPositionInsideRoom = (room, position) => {
  let minRow = Infinity, maxRow = -Infinity;
  let minCol = Infinity, maxCol = -Infinity;

  room.walls.forEach(wall => {
    minRow = Math.min(minRow, wall.row);
    maxRow = Math.max(maxRow, wall.row);
    minCol = Math.min(minCol, wall.column);
    maxCol = Math.max(maxCol, wall.column);
  });

  room.doors.forEach(door => {
    minRow = Math.min(minRow, door.row);
    maxRow = Math.max(maxRow, door.row);
    minCol = Math.min(minCol, door.column);
    maxCol = Math.max(maxCol, door.column);
  });

  return (
    position.row >= minRow &&
    position.row <= maxRow &&
    position.column >= minCol &&
    position.column <= maxCol
  );
};