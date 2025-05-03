/**
 * @fileoverview Servicios para la comunicación con la API relacionada con usuarios
 * @author Samuel Felipe
 */

import { API_URL } from "../utils/constants";

export const registerUser = async (data) => {
  return await fetch(`${API_URL}/api/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
}

export const loginUser = async (userData) => {
  return await fetch(`${API_URL}/api/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include',
  })
    .then((res) => res.json())
};

export const logoutUser = async () => {
  return await fetch(`${API_URL}/api/user/logout`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((res) => res.json())
}