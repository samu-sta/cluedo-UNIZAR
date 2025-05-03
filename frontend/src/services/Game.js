/**
 * @fileoverview Servicios para la comunicación con la API relacionada con juegos
 * @author Samuel Felipe
 */

import { API_URL } from "../utils/constants";

export const createGame = async () => {
  try {
    const response = await fetch(`${API_URL}/api/game/create`, {
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
    const response = await fetch(`${API_URL}/api/game/join/${gameId}`, {
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
    const response = await fetch(`${API_URL}/api/game/random`, {
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