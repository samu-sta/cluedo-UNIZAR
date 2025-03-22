
export const ROOMS_DATA = [
  { name: 'Biblioteca' },
  { name: 'Cocina' },
  { name: 'Salón' },
  { name: 'Comedor' },
  { name: 'Sala de Billar' },
  { name: 'Vestíbulo' },
  { name: 'Salón de Baile' },
  { name: 'Invernadero' },
  { name: 'Estudio' }
];

export const WALLS_CONFIG = {
  'Biblioteca': [
    { row: 1, column: 1 }, { row: 1, column: 2 }, { row: 1, column: 3 }, { row: 1, column: 4 }, { row: 1, column: 5 },
    { row: 2, column: 1 }, { row: 3, column: 1 }, { row: 4, column: 1 }, { row: 5, column: 1 },
    { row: 2, column: 5 }, { row: 3, column: 5 }, { row: 4, column: 5 }, { row: 5, column: 5 },
    { row: 6, column: 1 }, { row: 6, column: 2 }, { row: 6, column: 4 }, { row: 6, column: 5 }
  ],
  'Cocina': [
    { row: 1, column: 19 }, { row: 1, column: 20 }, { row: 1, column: 21 }, { row: 1, column: 22 }, { row: 1, column: 23 },
    { row: 2, column: 19 }, { row: 2, column: 23 },
    { row: 3, column: 19 }, { row: 3, column: 23 },
    { row: 4, column: 19 }, { row: 4, column: 20 }, { row: 4, column: 22 }, { row: 4, column: 23 }
  ],
  'Salón': [
    { row: 10, column: 10 }, { row: 10, column: 11 }, { row: 10, column: 12 }, { row: 10, column: 13 }, { row: 10, column: 14 },
    { row: 11, column: 10 }, { row: 11, column: 14 },
    { row: 12, column: 10 }, { row: 12, column: 14 },
    { row: 13, column: 10 }, { row: 13, column: 11 }, { row: 13, column: 13 }, { row: 13, column: 14 }
  ],
  'Comedor': [
    { row: 8, column: 1 }, { row: 8, column: 2 }, { row: 8, column: 3 }, { row: 8, column: 4 }, { row: 8, column: 5 },
    { row: 9, column: 1 }, { row: 9, column: 5 },
    { row: 10, column: 1 }, { row: 10, column: 5 },
    { row: 11, column: 1 }, { row: 11, column: 2 }, { row: 11, column: 4 }, { row: 11, column: 5 }
  ],
  'Sala de Billar': [
    { row: 15, column: 1 }, { row: 15, column: 2 }, { row: 15, column: 3 }, { row: 15, column: 4 }, { row: 15, column: 5 },
    { row: 16, column: 1 }, { row: 16, column: 5 },
    { row: 17, column: 1 }, { row: 17, column: 5 },
    { row: 18, column: 1 }, { row: 18, column: 2 }, { row: 18, column: 4 }, { row: 18, column: 5 }
  ],
  'Vestíbulo': [
    { row: 20, column: 10 }, { row: 20, column: 11 }, { row: 20, column: 12 }, { row: 20, column: 13 }, { row: 20, column: 14 },
    { row: 21, column: 10 }, { row: 21, column: 14 },
    { row: 22, column: 10 }, { row: 22, column: 14 },
    { row: 23, column: 10 }, { row: 23, column: 11 }, { row: 23, column: 13 }, { row: 23, column: 14 }
  ],
  'Salón de Baile': [
    { row: 20, column: 17 }, { row: 20, column: 18 }, { row: 20, column: 19 }, { row: 20, column: 20 }, { row: 20, column: 21 },
    { row: 21, column: 17 }, { row: 21, column: 21 },
    { row: 22, column: 17 }, { row: 22, column: 21 },
    { row: 23, column: 17 }, { row: 23, column: 18 }, { row: 23, column: 20 }, { row: 23, column: 21 }
  ],
  'Invernadero': [
    { row: 15, column: 19 }, { row: 15, column: 20 }, { row: 15, column: 21 }, { row: 15, column: 22 }, { row: 15, column: 23 },
    { row: 16, column: 19 }, { row: 16, column: 23 },
    { row: 17, column: 19 }, { row: 17, column: 23 },
    { row: 18, column: 19 }, { row: 18, column: 20 }, { row: 18, column: 22 }, { row: 18, column: 23 }
  ],
  'Estudio': [
    { row: 1, column: 8 }, { row: 1, column: 9 }, { row: 1, column: 10 }, { row: 1, column: 11 }, { row: 1, column: 12 },
    { row: 2, column: 8 }, { row: 2, column: 12 },
    { row: 3, column: 8 }, { row: 3, column: 12 },
    { row: 4, column: 8 }, { row: 4, column: 9 }, { row: 4, column: 11 }, { row: 4, column: 12 }
  ]
};

export const DOORS_CONFIG = {
  'Biblioteca': [{ row: 6, column: 3 }],
  'Cocina': [{ row: 4, column: 21 }],
  'Salón': [
    { row: 10, column: 12 },
    { row: 13, column: 12 }
  ],
  'Comedor': [{ row: 11, column: 3 }],
  'Sala de Billar': [{ row: 18, column: 3 }],
  'Vestíbulo': [{ row: 20, column: 12 }],
  'Salón de Baile': [{ row: 20, column: 19 }],
  'Invernadero': [{ row: 18, column: 21 }],
  'Estudio': [{ row: 4, column: 10 }]
};

export const CARDS_DATA = {
  characters: [
    'Coronel Mostaza',
    'Profesor Ciruela',
    'Señora Blanco',
    'Señorita Escarlata',
    'Señor Verde',
    'Señora Azulino'
  ],
  weapons: [
    'Candelabro',
    'Puñal',
    'Tubería de Plomo',
    'Pistola',
    'Cuerda',
    'Llave Inglesa'
  ]
};

export const BOARD_CONFIG = {
  rows: 24,
  columns: 24
};

export default {
  ROOMS_DATA,
  WALLS_CONFIG,
  DOORS_CONFIG,
  CARDS_DATA,
  BOARD_CONFIG
};