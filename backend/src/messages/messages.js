/*************************************************
 * Mensajes del Sistema
 * 
 * Este archivo contiene todos los mensajes de texto
 * utilizados en la aplicación, centralizando la gestión
 * de textos para facilitar su mantenimiento y posibles
 * traducciones futuras.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

const USER_NOT_FOUND = "Usuario no encontrado";
const INVALID_PASSWORD = "Contraseña incorrecta";
const EMAIL_ALREADY_EXISTS = "El email ya existe";
const REGISTRATION_SUCCESS = "Registro completado con éxito";
const LOGIN_SUCCESS = "Sesión iniciada correctamente";
const INVALID_CREDENTIALS = "Credenciales inválidas";
const LOGOUT_SUCCESS = "Sesión cerrada correctamente";
const INVALID_DATA = "Datos inválidos";
const ERROR_500 = "Error interno del servidor";
const UNAUTHORIZED = "No autorizado";
const GAME_NOT_FOUND = "Partida no encontrada";
const GAME_ALREADY_STARTED = "La partida ya ha comenzado";
const GAME_NOT_IN_PROGRESS = "El juego no está en curso";
const NOT_YOUR_TURN = "No es tu turno";
const DICE_ALREADY_ROLLED = "Ya lanzaste los dados";
const INVALID_MOVE = "Movimiento no válido";
const PLAYER_NOT_FOUND = "Jugador no encontrado";
const MUST_ROLL_DICE_FIRST = "Debes tirar los dados primero";
const MUST_MOVE_BEFORE_SUGGESTION = "Debes moverte antes de hacer una sugerencia";
const ALREADY_MADE_SUGGESTION = "Ya has hecho una sugerencia en este turno";
const NOT_IN_ROOM = "No estás en una habitación";
const SUGGESTION_ROOM_MISMATCH = "Solo puedes hacer una sugerencia para la habitación donde estás";
const NO_ACTIVE_SUGGESTION = "No hay una sugerencia activa";
const CARD_NOT_FOUND = "No tienes esa carta";
const SUGGESTION_PLAYER_NOT_FOUND = "No se pudo encontrar al jugador que hizo la sugerencia";
const ACCUSATION_PROCESSING_ERROR = "Error al procesar la acusación";
const CONNECTION_ERROR = "Error de conexión al servidor";
const GAME_JOIN_ERROR = "Error al unirse a la partida";
const GAME_CREATE_ERROR = "Error al crear la partida";
const ALL_PLAYERS_LEFT = "Todos los jugadores han abandonado la partida";
const SOLVED_CASE_CORRECTLY = "ha resuelto correctamente el caso.";
const INCORRECT_ACCUSATION = "Tu acusación es incorrecta. Has sido eliminado de la partida.";
const LAST_PLAYER_ELIMINATED = "ha sido eliminado por una acusación incorrecta. Solo queda un jugador.";
const PLAYER_LEFT_ONE_REMAINING = "ha abandonado la partida. Solo queda un jugador.";
const GAME_NOT_STARTED = "El juego no ha comenzado";
const DISCONNECTION = "desconexión";
const ALREADY_IN_GAME = "Ya estás en una partida";
const GAME_FULL = "La partida está llena";

const MESSAGES = {
  USER_NOT_FOUND,
  INVALID_PASSWORD,
  EMAIL_ALREADY_EXISTS,
  REGISTRATION_SUCCESS,
  LOGIN_SUCCESS,
  INVALID_CREDENTIALS,
  LOGOUT_SUCCESS,
  INVALID_DATA,
  ERROR_500,
  UNAUTHORIZED,
  GAME_NOT_FOUND,
  GAME_ALREADY_STARTED,
  GAME_NOT_IN_PROGRESS,
  NOT_YOUR_TURN,
  DICE_ALREADY_ROLLED,
  INVALID_MOVE,
  PLAYER_NOT_FOUND,
  MUST_ROLL_DICE_FIRST,
  MUST_MOVE_BEFORE_SUGGESTION,
  ALREADY_MADE_SUGGESTION,
  NOT_IN_ROOM,
  SUGGESTION_ROOM_MISMATCH,
  NO_ACTIVE_SUGGESTION,
  CARD_NOT_FOUND,
  SUGGESTION_PLAYER_NOT_FOUND,
  ACCUSATION_PROCESSING_ERROR,
  CONNECTION_ERROR,
  GAME_JOIN_ERROR,
  GAME_CREATE_ERROR,
  ALL_PLAYERS_LEFT,
  SOLVED_CASE_CORRECTLY,
  INCORRECT_ACCUSATION,
  LAST_PLAYER_ELIMINATED,
  PLAYER_LEFT_ONE_REMAINING,
  GAME_NOT_STARTED,
  DISCONNECTION,
  ALREADY_IN_GAME,
  GAME_FULL
};

export default MESSAGES;