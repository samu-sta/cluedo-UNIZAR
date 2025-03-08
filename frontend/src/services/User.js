const API_URL = 'http://localhost:3000/api';

export const registerUser = async (data) => {
  return await fetch(`${API_URL}/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
}

export const loginUser = async (userData) => {
  return await fetch(`${API_URL}/user/login`, {
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
  return await fetch(`${API_URL}/user/logout`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((res) => res.json())
}