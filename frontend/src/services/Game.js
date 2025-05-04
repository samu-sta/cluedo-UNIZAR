/*************************************************
 * Servicios de gestión de partidas
 * 
 * Proporciona funciones para interactuar con la API 
 * del backend relacionadas con la creación, unión y 
 * gestión de partidas de juego.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/

const API_URL = 'http://localhost:3000/api';

export const createGame = async () => {
  try {
    const response = await fetch(`${API_URL}/game/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    return await response.json();
  }
  catch (error) {
    console.error('Error creating game:', error);
    return { error: 'Error de conexión al servidor' };
  }
};

export const joinGame = async (gameId) => {
  try {
    const response = await fetch(`${API_URL}/game/join/${gameId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    return await response.json();
  }
  catch (error) {
    console.error('Error joining game:', error);
    return { error: 'Error de conexión al servidor' };
  }
};

export const findRandomGame = async () => {
  try {
    const response = await fetch(`${API_URL}/game/random`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    return await response.json();
  }
  catch (error) {
    console.error('Error finding random game:', error);
    return { error: 'Error de conexión al servidor' };
  }
};