import { getCards } from "../utils/game.js";
export default class GameStateManager {
  constructor() {
    this.games = new Map();
  }

  initGame(gameId) {
    if (!this.games.has(gameId)) {
      this.games.set(gameId, {
        players: new Map(),
        timer: null,
        countdown: null,
        state: 'waiting'
      });
    }
    return this.games.get(gameId);
  }

  getGame(gameId) {
    return this.games.get(gameId);
  }

  hasGame(gameId) {
    return this.games.has(gameId);
  }

  addPlayer(gameId, userId, playerData) {
    const game = this.initGame(gameId);
    if (!game.players.has(userId)) {
      game.players.set(userId, playerData);
      return true;
    }
    return false;
  }

  removePlayer(gameId, userId) {
    if (!this.hasGame(gameId)) return false;

    const game = this.getGame(gameId);
    const wasRemoved = game.players.delete(userId);

    if (game.players.size === 0) {
      this.removeGame(gameId);
    }

    return wasRemoved;
  }

  removeGame(gameId) {
    return this.games.delete(gameId);
  }

  getPlayers(gameId) {
    if (!this.hasGame(gameId)) return [];
    return Array.from(this.getGame(gameId).players.values());
  }

  getPlayerCount(gameId) {
    if (!this.hasGame(gameId)) return 0;
    return this.getGame(gameId).players.size;
  }

  setGameState(gameId, state) {
    if (!this.hasGame(gameId)) return;
    this.getGame(gameId).state = state;
  }

  getGameState(gameId) {
    if (!this.hasGame(gameId)) return 'waiting';
    return this.getGame(gameId).state;
  }

  async setupGame(gameId) {
    if (!this.hasGame(gameId)) return false;

    const allCards = await this.getAllCards();
    const solution = this.selectSolution(allCards);
    const playerCards = this.distributeCards(solution.remainingCards, gameId);

    const game = this.getGame(gameId);
    game.solution = solution;
    game.playerCards = playerCards;
    return true;
  }

  async getAllCards() {
    const cards = await getCards();
    const characters = cards.filter(card => card.type === 'character');
    const weapons = cards.filter(card => card.type === 'weapon');
    const rooms = cards.filter(card => card.type === 'room');
    return { characters, weapons, rooms, allCards: [...characters, ...weapons, ...rooms] };
  }

  selectSolution(allCards) {
    const character = this.getRandomCard(allCards.characters);
    const weapon = this.getRandomCard(allCards.weapons);
    const room = this.getRandomCard(allCards.rooms);

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
  }

  getRandomCard(cards) {
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex];
  }

  distributeCards(cards, gameId) {
    const players = Array.from(this.getGame(gameId).players.keys());
    const playerCount = players.length;

    const shuffledCards = this.shuffleArray([...cards]);
    const playerCards = {};
    const leftoverCards = [];

    players.forEach(playerId => {
      playerCards[playerId] = [];
    });

    const cardsPerPlayer = Math.floor(shuffledCards.length / playerCount);

    shuffledCards.forEach((card, index) => {
      if (index < cardsPerPlayer * playerCount) {
        const playerIndex = Math.floor(index / cardsPerPlayer);
        const playerId = players[playerIndex];
        playerCards[playerId].push(card);
      } else {
        leftoverCards.push(card);
      }
    });

    const game = this.getGame(gameId);
    game.leftoverCards = leftoverCards;

    return playerCards;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  getPlayerCards(gameId, userId) {
    if (!this.hasGame(gameId)) return [];

    const game = this.getGame(gameId);
    return game.playerCards?.[userId] || [];
  }

  getSolution(gameId) {
    if (!this.hasGame(gameId)) return null;

    const game = this.getGame(gameId);
    return game.solution ? {
      character: game.solution.character,
      weapon: game.solution.weapon,
      room: game.solution.room
    } : null;
  }

  getLeftoverCards(gameId) {
    if (!this.hasGame(gameId)) return [];

    const game = this.getGame(gameId);
    return game.leftoverCards || [];
  }
}