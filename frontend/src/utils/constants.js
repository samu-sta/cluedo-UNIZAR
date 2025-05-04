export const HOME = {
  HERO: {
    ASIDE: "¡Nuevo juego!",
    TITLE: "Bienvenido a",
    BRAND: "Cluedo UNIZAR",
    DESCRIPTION: "Descubre el misterio, encuentra al culpable y conviértete en el mejor detective de la universidad.",
    REGISTER_BTN: "Registrarse",
    LOGIN_BTN: "Iniciar sesión",
    STATS: [
      {
        value: "1000+",
        label: "Jugadores"
      },
      {
        value: "10.0",
        label: "Valoración"
      },
      {
        value: "24/7",
        label: "Disponible"
      }
    ],
    IMAGE_ALT: "Detective investigando un caso"
  },
  FEATURES: {
    TITLE: "¿Por qué jugar?",
    DESCRIPTION: "Descubre por qué Cluedo UNIZAR es el juego más popular entre estudiantes",
    ITEMS: [
      {
        icon: '🎮',
        iconLabel: 'Juego',
        title: 'Partidas desafiantes',
        description: 'Pon a prueba tus habilidades de deducción en partidas en tiempo real.'
      },
      {
        icon: '🏆',
        iconLabel: 'Trofeo',
        title: 'Sube de rango',
        description: 'Gana partidas y escala en el ranking de detectives de UNIZAR.'
      },
      {
        icon: '👥',
        iconLabel: 'Amigos',
        title: 'Juega con amigos',
        description: 'Crea partidas privadas e invita a tus amigos para competir.'
      }
    ]
  },
  RULES: {
    TITLE: "Reglas del juego",
    SUBTITLE: "¿Cómo se juega?",
    DESCRIPTION: "En Cluedo UNIZAR, tu objetivo es descubrir quién cometió el crimen, con qué arma y en qué lugar.",
    ITEMS: [
      'Haz suposiciones inteligentes sobre el crimen',
      'Elimina sospechosos, armas y lugares',
      'Recopila pistas de otros jugadores',
      'Sé el primero en resolver el caso'
    ],
    VIEW_RULES_BTN: "Ver reglas completas"
  },
  CTA: {
    TITLE: "¿Estás listo para resolver el misterio?",
    DESCRIPTION: "Únete ahora y comienza tu carrera como detective.",
    BUTTON: "¡Registrarse ahora!",
    NOTE: "Registrate y juega gratis a Cluedo UNIZAR descargas ni anuncios"
  },
  IMAGES: {
    DETECTIVE: "/images/detective.png",
    GAME_BOARD: "/images/game-board.png"
  }
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  RULES: "/rules",
  GAMES: "/games",
  PROFILE: "/profile"
};

export const REGISTER_FORM_FIELDS = [
  {
    id: 'username',
    name: 'username',
    type: 'text',
    label: 'Nombre de usuario',
    autoFocus: true,
    required: true,
  },
  {
    id: 'email',
    name: 'email',
    type: 'text',
    label: 'Correo electrónico',
    autoFocus: false,
    required: true,
  },
  {
    id: 'password',
    name: 'password',
    type: 'password',
    label: 'Contraseña',
    autoFocus: false,
    required: true,
  },
  {
    id: 'confirmPassword',
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirmar contraseña',
    autoFocus: false,
    required: true,
  }
];

export const LOGIN_FORM_FIELDS = [
  {
    id: 'email',
    name: 'email',
    type: 'email',
    label: 'Correo electrónico',
    autoFocus: true,
    autoComplete: 'email',
    required: true,
    placeholder: 'ejemplo@correo.com'
  },
  {
    id: 'password',
    name: 'password',
    type: 'password',
    label: 'Contraseña',
    autoFocus: false,
    autoComplete: 'current-password',
    required: true,
    placeholder: 'Ingresa tu contraseña'
  }
];