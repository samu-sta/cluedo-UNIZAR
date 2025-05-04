/*************************************************
 * Utilidades para Arrays
 * 
 * Este archivo contiene funciones de utilidad para
 * trabajar con arrays, incluyendo algoritmos de
 * aleatorización y selección de elementos al azar.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} - The shuffled array
 */
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Selects a random item from an array
 * @param {Array} array - The array to select from
 * @returns {*} - A random item from the array
 */
export const getRandomItem = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};