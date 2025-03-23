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
  // Borde superior, posición central izquierda
  'Biblioteca': [
    { row: 4, column: 1 }, { row: 4, column: 4 },
    { row: 4, column: 5 }, { row: 4, column: 6 },
    { row: 3, column: 6 },
    { row: 2, column: 6 }, { row: 1, column: 6 }
  ],

  // Borde superior, posición central
  'Estudio': [
    { row: 1, column: 8 }, { row: 2, column: 8 }, { row: 3, column: 8 }, { row: 4, column: 8 },
    { row: 4, column: 12 }, { row: 3, column: 12 },
    { row: 2, column: 12 }, { row: 1, column: 12 }
  ],

  // Borde superior, esquina derecha
  'Cocina': [
    { row: 1, column: 14 }, { row: 4, column: 14 }, { row: 4, column: 15 }, { row: 4, column: 16 }, { row: 4, column: 17 }, { row: 4, column: 18 }
  ],

  // Borde izquierdo
  'Comedor': [
    { row: 6, column: 1 }, { row: 6, column: 2 }, { row: 6, column: 3 }, { row: 6, column: 4 },
    { row: 6, column: 5 }, { row: 6, column: 6 },
    { row: 10, column: 6 },
    { row: 11, column: 1 }, { row: 11, column: 2 }, { row: 11, column: 3 }, { row: 11, column: 4 },
    { row: 11, column: 5 }, { row: 11, column: 6 }
  ],

  // Borde inferior izquierdo
  'Sala de Billar': [
    { row: 14, column: 1 }, { row: 14, column: 2 }, { row: 14, column: 5 }, { row: 14, column: 6 },
    { row: 15, column: 6 },
    { row: 16, column: 6 },
    { row: 17, column: 6 },
    { row: 18, column: 6 }
  ],

  // Borde inferior central
  'Vestíbulo': [
    { row: 15, column: 8 }, { row: 15, column: 12 },
    { row: 16, column: 8 }, { row: 16, column: 12 },
    { row: 17, column: 8 }, { row: 17, column: 12 },
    { row: 18, column: 8 }, { row: 18, column: 12 }
  ],

  // Borde inferior derecho
  'Salón de Baile': [
    { row: 16, column: 18 }, { row: 16, column: 15 },
    { row: 16, column: 14 }, { row: 17, column: 14 }, { row: 18, column: 14 }
  ],

  // Borde derecho superior
  'Salón': [
    { row: 6, column: 15 }, { row: 6, column: 16 }, { row: 6, column: 17 }, { row: 6, column: 18 },
    { row: 7, column: 15 },
    { row: 8, column: 15 },
    { row: 9, column: 15 }, { row: 9, column: 16 }, { row: 9, column: 17 }, { row: 9, column: 18 }
  ],

  // Borde derecho inferior
  'Invernadero': [
    { row: 11, column: 15 }, { row: 11, column: 16 }, { row: 11, column: 18 },
    { row: 12, column: 15 },
    { row: 13, column: 15 },
    { row: 14, column: 15 }, { row: 14, column: 16 }, { row: 14, column: 17 }, { row: 14, column: 18 }
  ]
};

export const DOORS_CONFIG = {
  'Biblioteca': [
    { row: 4, column: 2 },
    { row: 4, column: 3 }
  ],
  'Cocina': [
    { row: 2, column: 14 },
    { row: 3, column: 14 }
  ],
  'Salón': [
    { row: 7, column: 15 },
    { row: 8, column: 15 }
  ],
  'Comedor': [
    { row: 7, column: 6 },
    { row: 8, column: 6 },
    { row: 9, column: 6 }

  ],
  'Sala de Billar': [
    { row: 14, column: 3 },
    { row: 14, column: 4 },
    { row: 14, column: 5 }
  ],
  'Vestíbulo': [
    { row: 15, column: 9 },
    { row: 15, column: 10 },
    { row: 15, column: 11 }
  ],
  'Salón de Baile': [
    { row: 16, column: 17 },
    { row: 16, column: 16 }
  ],
  'Invernadero': [
    { row: 11, column: 17 }
  ],
  'Estudio': [
    { row: 4, column: 10 },
    { row: 4, column: 9 },
    { row: 4, column: 11 }
  ]
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
  rows: 18,
  columns: 18
};

export default {
  ROOMS_DATA,
  WALLS_CONFIG,
  DOORS_CONFIG,
  CARDS_DATA,
  BOARD_CONFIG
};