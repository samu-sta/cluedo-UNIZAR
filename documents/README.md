# 🎲 Cluedo UNIZAR - Documentación del Proyecto

> [!NOTE]
> Esta documentación refleja el estado actual del proyecto completo a día 3 de mayo de 2025. Contiene información detallada sobre la arquitectura, componentes y funcionalidades implementadas.

## 💻 1. Tecnologías Utilizadas

### 1.1 Frontend
- **React 19**: Framework principal basado en componentes para la interfaz de usuario
- **React Router DOM 7.2.0**: Manejo de rutas y navegación
- **React Icons 5.5.0**: Biblioteca de iconos
- **Zod 3.24.2**: Validación de formularios
- **Vite 6.2.0**: Herramienta de compilación y servidor de desarrollo
- **Socket.IO Client 5.1.0**: Cliente para comunicación en tiempo real

### 1.2 Backend
- **Node.js**: Entorno de ejecución para JavaScript en servidor
- **Express 4.21.2**: Framework web minimalista y flexible
- **Sequelize 6.37.5**: ORM para manejar la base de datos
- **MySQL2 3.12.0**: Driver para la conexión con MySQL
- **Argon2 0.41.1**: Algoritmo seguro para hash de contraseñas
- **JSONWebToken 9.0.2**: Implementación de tokens JWT
- **Cookie-Parser 1.4.7**: Middleware para manejar cookies
- **Socket.IO 5.0.0**: Servidor para comunicación en tiempo real
- **Dotenv 16.4.7**: Carga variables de entorno desde archivo .env
- **Zod 3.24.2**: Validación de datos de entrada de peticiones HTTP

## 🏛️ 2. Arquitectura del Proyecto

```
cluedo/
├── frontend/        # Aplicación React
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   │   ├── Board/           # Componentes del tablero de juego
│   │   │   ├── PlayerCards/     # Visualización de cartas del jugador
│   │   │   └── deductionTable/  # Tabla de deducciones para el jugador
│   │   ├── pages/       # Páginas de la aplicación
│   │   │   ├── GameRoom/     # Interfaz de sala de juego
│   │   │   │   └── components/  # Componentes específicos de la sala de juego
│   │   │   │       ├── AccusationModal.jsx        # Modal para hacer acusaciones
│   │   │   │       └── IncorrectAccusationModal.jsx  # Modal para acusaciones fallidas
│   │   │   └── startGames/   # Creación/unión a partidas
│   │   ├── hooks/       # Custom React hooks
│   │   │   ├── useGameSocket.jsx  # Hook para gestionar sockets
│   │   │   ├── useDeductions.jsx  # Hook para la tabla de deducciones
│   │   │   └── useIsMobile.jsx    # Hook para detectar dispositivos móviles
│   │   ├── services/    # Servicios para API calls
│   │   │   ├── Game.js          # Servicios de partidas
│   │   │   └── Socket.js        # Configuración de Socket.IO
│   │   └── schemas/     # Esquemas de validación
├── backend/         # Servidor Node.js
│   ├── src/
│   │   ├── app/          # Configuración de la aplicación
│   │   ├── auth/         # Lógica de autenticación
│   │   ├── controllers/  # Controladores de rutas
│   │   ├── database/     # Configuración de la base de datos
│   │   ├── messages/     # Mensajes de respuesta
│   │   ├── models/       # Modelos de datos
│   │   ├── routes/       # Definición de rutas
│   │   ├── socket/       # Configuración de Socket.IO y gestión de partidas
│   │   │   ├── GameStateManager.js  # Gestión centralizada del estado de juego
│   │   │   ├── CountdownManager.js  # Gestión de cuenta regresiva
│   │   │   └── handlers/            # Manejadores de eventos socket
│   │   │       ├── gameHandlers.js       # Eventos generales del juego
│   │   │       ├── movementHandlers.js   # Eventos de movimiento
│   │   │       ├── suggestionHandlers.js # Eventos de sugerencias y acusaciones
│   │   │       └── utils.js              # Utilidades comunes para handlers
│   │   ├── services/      # Servicios de lógica de negocio
│   │   │   ├── GameService.js       # Gestión general de partidas
│   │   │   ├── BoardService.js      # Gestión del tablero
│   │   │   ├── CardService.js       # Gestión de cartas
│   │   │   ├── SuggestionService.js # Gestión de sugerencias y acusaciones
│   │   │   └── PlayerService.js     # Gestión de jugadores
│   │   ├── config/       # Configuraciones del juego
│   │   │   └── gameConstants.js    # Constantes para el tablero y cartas
│   │   ├── utils/        # Utilidades del juego
│   │   │   ├── board.js           # Algoritmos de movimiento en el tablero
│   │   │   └── game.js            # Utilidades generales del juego
└── documents/       # Documentación del proyecto
```

## 🔐 3. Sistema de Autenticación

El sistema utiliza autenticación basada en JWT (JSON Web Tokens) con las siguientes características:

- **Almacenamiento de Tokens**: Los tokens JWT se almacenan en cookies HTTP-only para mayor seguridad.
- **Hashing de Contraseñas**: Utilización de Argon2, un algoritmo de hashing moderno y seguro.
- **Operaciones soportadas**:
  - Registro de usuarios (`/user/register`)
  - Inicio de sesión (`/user/login`)
  - Cierre de sesión (`/user/logout`)
- **Expiración de Tokens**: Los tokens expiran después de 24 horas (86400 segundos).

### 3.1 Flujo de Autenticación
1. Usuario envía credenciales (email/contraseña)
2. Backend valida con Zod y verifica en la base de datos
3. Si las credenciales son correctas, se genera un token JWT
4. El token se envía al cliente como cookie HTTP-only
5. Las solicitudes posteriores incluyen automáticamente esta cookie
6. El backend verifica el token en cada solicitud protegida

## 🗄️ 4. Base de Datos

- **Sistema**: MySQL 8.0
- **ORM**: Sequelize para un manejo minimalista de la base de datos
- **Modelos principales**:
  - `AccountModel`: Almacena información básica de cuentas (username, email, password hashed)
  - `UserModel`: Establece relación con Account para usuarios regulares
  - `GameModel`: Información básica del juego
  - `BoardModel`: Configuración del tablero (filas, columnas)
  - `RoomModel`: Habitaciones del tablero de juego
  - `WallModel`: Representa las paredes en las habitaciones
  - `DoorModel`: Representa las puertas entre habitaciones
  - `CardModel`: Cartas del juego (armas, personajes, habitaciones)
- **Relaciones**:
  - Account → User (one-to-one)
  - Game → Board (one-to-one)
  - Game → Card (one-to-many)
  - Board → Room (one-to-many)
  - Room → Wall (one-to-many)
  - Room → Door (one-to-many)
- **Inicialización**: El script init.js crea la base de datos y tablas necesarias.

## 🔌 5. API REST

### 5.1 Endpoints de Usuario
- `POST /user/register`: Registro de nuevos usuarios
- `POST /user/login`: Autenticación de usuarios
- `POST /user/logout`: Cierre de sesión

### 5.2 Endpoints de Juego
- `POST /game/create`: Creación de una nueva partida
- `POST /game/join/:gameId`: Unirse a una partida existente

### 5.3 Validación de Datos
- Todas las entradas son validadas mediante esquemas Zod.
- Manejo consistente de errores con mensajes descriptivos.

## 🖥️ 6. Frontend

### 6.1 Componentes Principales
- `Header`: Barra de navegación superior
- `Footer`: Pie de página
- `Home`: Página principal con secciones para características y reglas
- `Login/Register`: Formularios de autenticación
- `StartGames`: Interfaz para iniciar partidas
- `GameRoom`: Sala de juego completa
- `Board`: Tablero interactivo del juego
- `PlayerCards`: Visor de cartas del jugador
- `DeductionTable`: Tabla para realizar deducciones durante el juego
- `DiceRoller`: Componente para lanzar dados y mostrar resultados
- **Modales**:
  - `AccusationModal`: Interfaz para realizar acusaciones finales
  - `IncorrectAccusationModal`: Notificación de acusación incorrecta
  - `SuggestionModal`: Interfaz para realizar sugerencias
  - `SuggestionResponseModal`: Respuesta a sugerencias de otros jugadores
  - `ShowCardModal`: Mostrar cartas durante el juego
  - `GameEndedModal`: Notificación al finalizar la partida

### 6.2 Hooks Personalizados
- `useIsMobile`: Detección de dispositivos móviles
- `useHeader`: Lógica para el encabezado responsivo
- `useLoginPage`: Manejo del formulario de login
- `useRegisterPage`: Manejo del formulario de registro
- `useStartGames`: Lógica para iniciar partidas
- `useGameSocket`: Gestión de la comunicación socket durante la partida
- `useDeductions`: Estado y lógica para la tabla de deducciones
- `useGameEndedModal`: Control del modal de fin de partida
- `useSuggestionResponse`: Lógica para las respuestas a sugerencias

### 6.3 Componentes de Juego
- **Board**: Representación visual del tablero con habitaciones
- **WaitingRoom**: Sala de espera para jugadores antes de comenzar
- **PlayerCards**: Visualizador de cartas repartidas al jugador
  - Muestra cartas de personajes, armas y habitaciones
  - Sección especial para cartas sobrantes
- **DeductionTable**: Tabla para realizar deducciones
  - Permite marcar cartas como confirmadas, descartadas o posibles
  - Descarta automáticamente las cartas que tiene el jugador y las sobrantes
  - Interfaz adaptable en dispositivos móviles
- **DiceRoller**: Componente para lanzar y mostrar dados
  - Visualización de dados con puntos
  - Animación de lanzamiento
  - Control de cuándo se pueden lanzar dados

### 6.4 Estilos
- CSS modular por componente
- Variables CSS para temas consistentes
- Diseño responsivo para móviles y escritorio
- Animaciones para mejorar la experiencia de usuario

## 🎮 7. Sistema de Partidas y Comunicación en Tiempo Real

### 7.1 Gestión de Partidas
- **Creación de partidas**: Generación de identificadores únicos (UUID)
- **Unión a partidas existentes**: Mediante código de partida
- **Persistencia en memoria principal**: Las partidas activas se mantienen en un Map centralizado
- **Estados de partida**:
  - `waiting`: Esperando jugadores
  - `countdown`: Cuenta regresiva antes de comenzar
  - `playing`: Partida en curso
  - `ended`: Partida finalizada

### 7.2 Dinámica de Juego
- **Cartas**: Sistema de cartas con personajes, armas y habitaciones
- **Inicio de partida**: Comienza cuando hay suficientes jugadores
- **Cuenta regresiva**: Temporizador de 10 segundos antes de comenzar
- **Distribución de cartas**: Sistema para repartir cartas a los jugadores
- **Cartas sobrantes**: Gestión de cartas que quedan sin repartir

### 7.3 Socket.IO
- **Arquitectura de comunicación**: Implementación de patrón publisher-subscriber
- **Autenticación de socket**: Mediante tokens JWT específicos para cada partida
- **Salas (rooms)**: Cada partida tiene su propia sala para comunicación aislada
- **Auto-limpieza**: Las partidas se eliminan automáticamente cuando quedan vacías
- **Reconexión**: Manejo de actualización de página y reconexiones
- **Estructura de handlers**: Organización modular en carpetas por funcionalidad
- **Eventos principales**:
  - `playerJoined`: Cuando un nuevo jugador se une a la partida
  - `playerLeft`: Cuando un jugador abandona la partida
  - `playerList`: Lista actualizada de jugadores en la sala
  - `countdownUpdate`: Actualización del contador de inicio
  - `gameStart`: Inicio de la partida
  - `playerCards`: Distribución de cartas a los jugadores
  - `diceRolled`: Resultado de tirar los dados y movimientos válidos
  - `playersMoved`: Notificación de movimiento de un jugador
  - `moveSuccess`: Confirmación de un movimiento exitoso
  - `suggestion`: Realización de sugerencias durante el juego
  - `accusation`: Realización de acusaciones finales
  - `correctAccusation`: Notificación de acusación correcta y fin de juego
  - `incorrectAccusation`: Notificación de acusación incorrecta y eliminación del jugador
  - `gameEnd`: Finalización de la partida
  - `leaveGame`: Abandono explícito de una partida

### 7.4 Interfaz durante el juego
- **Visualización de cartas**: Componente para ver las cartas asignadas al jugador
- **Tabla de deducciones**: Herramienta para realizar deducciones lógicas
- **Modales informativos**: Modales para fin de juego y abandono de partida
- **Adaptabilidad**: Diseño responsive para diferentes dispositivos

### 7.5 Sistema de Turnos
- **Orden aleatorio**: Los turnos de los jugadores se determinan aleatoriamente al iniciar la partida
- **Indicador visual**: Todos los jugadores pueden ver de quién es el turno actual
- **Indicación especial**: Cuando es el turno de un jugador, se le muestra una notificación destacada
- **Control de turno**: El jugador con el turno actual puede pasarlo al siguiente jugador
- **Estados visuales**:
  - Turno normal: Muestra el nombre del jugador actual
  - Mi turno: Destaca visualmente y muestra un botón para pasar turno

### 7.6 Sistema de Dados y Movimiento
- **Lanzamiento de dados**: Los jugadores pueden lanzar dos dados durante su turno
- **Visualización de dados**: Representación gráfica del resultado de lanzamiento
- **Restricciones de lanzamiento**: Solo se puede lanzar una vez por turno
- **Algoritmo de movimiento**:
  - Utiliza BFS (búsqueda en anchura) para encontrar todos los movimientos válidos
  - Calcula automáticamente las casillas donde el jugador puede moverse según el resultado de los dados
  - Maneja casos especiales como puertas entre habitaciones
- **Validación de movimientos**:
  - Verifica que el movimiento esté dentro del rango permitido por los dados
  - Comprueba que no haya obstáculos (paredes) en el camino
  - Permite el uso de puertas para moverse entre habitaciones
- **Visualización de movimientos válidos**:
  - Las casillas donde el jugador puede moverse se destacan visualmente
- **Animación de movimiento**:
  - Animación visual cuando un jugador se mueve por el tablero
  - Cálculo y visualización de la ruta óptima entre la posición inicial y final

### 7.7 Sistema de Acusaciones y Sugerencias

- **Acusaciones finales**: 
  - Permiten a un jugador resolver el caso nombrando al culpable, el arma y la habitación
  - Solo se pueden realizar durante el turno del jugador
  - Interfaz modal con selección de personaje, arma y habitación
  - Advertencia clara sobre las consecuencias de una acusación incorrecta

- **Consecuencias**:
  - **Acusación correcta**: El jugador gana la partida inmediatamente
  - **Acusación incorrecta**: El jugador es eliminado de la partida
    - Sus cartas se redistribuyen entre los jugadores restantes
    - Se pasa el turno al siguiente jugador
    - Si queda un solo jugador, la partida termina

- **Validación**:
  - Verificación de que sea el turno del jugador
  - Comprobación del estado de la partida
  - Comparación de la acusación con la solución secreta

- **Flujo de proceso**:
  1. Jugador selecciona "Hacer Acusación" durante su turno
  2. Sistema muestra modal con opciones de personajes, armas y habitaciones
  3. Jugador confirma su acusación
  4. Servidor valida y procesa la acusación
  5. Notificación del resultado a todos los jugadores
  6. En caso de acusación incorrecta, se muestra un modal de eliminación
  7. En caso de acusación correcta, se muestra un modal de victoria y se finaliza el juego

- **Implementación**:
  - Frontend: Componentes modales (`AccusationModal`, `IncorrectAccusationModal`)
  - Backend: Servicios de validación y procesamiento (`SuggestionService`)
  - Comunicación: Eventos socket para transmisión de acusaciones y resultados

## 🐳 8. Docker

El proyecto está completamente dockerizado para facilitar el desarrollo y despliegue.

### 8.1 Servicios en Docker Compose
- **frontend**: Contenedor para la aplicación React (puerto 5173)
- **backend**: Contenedor para el servidor Node.js (puerto 3000)
- **db**: Contenedor para MySQL (puerto 3306)

### 8.2 Volúmenes
- Volumen persistente para datos de MySQL
- Volúmenes para código fuente (desarrollo)

### 8.3 Variables de Entorno

Las configuraciones se manejan mediante variables de entorno que se pueden definir en el archivo .env siguiendo la estructura del .env.example:
- Credenciales de base de datos
- Puerto del frontend y backend
- URL de API
- Secreto JWT

### 8.4 Comandos Útiles
```bash
# Levantar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f

# Reconstruir contenedores
docker-compose up -d --build
```

## 🛡️ 9. Seguridad

- **Contraseñas**: Hashed con Argon2, no se almacenan en texto plano
- **CORS**: Restricciones de origen cruzado configuradas
- **Cookies**: HTTP-only para tokens JWT
- **Validación**: Todas las entradas son validadas con Zod

## ⚙️ 10. Instalación y Configuración (Sin Docker)

### 10.1 Instalación de Dependencias

#### Frontend
```bash
# Navegar al directorio frontend
cd frontend

# Instalar todas las dependencias
npm install
```

#### Backend
```bash
# Navegar al directorio backend
cd backend

# Instalar todas las dependencias
npm install
```

### 10.2 Configuración de Variables de Entorno

El proyecto requiere que se creen los archivos .env en la carpeta backend, siguiendo la estructura del .env.example.

### 10.3 Ejecución del frontend y backend

#### Frontend
```bash
# Navegar al directorio frontend
cd frontend

# Ejecutar en modo desarrollo
npm run dev
```
#### Backend
```bash
# Navegar al directorio backend
cd backend

# Inicializar y ejecutar en modo desarrollo
npm start
```

## 🧪 11. Testing

El proyecto está completamente testeado utilizando Jest como framework de pruebas.

### 11.1 Cobertura de Pruebas
- **Cobertura global superior al 80%** en los componentes y lógica de negocio
- Suite completa de pruebas unitarias para componentes y hooks
- Pruebas de integración para flujos críticos (autenticación, juego, movimientos)
- Mocks para servicios externos y comunicación socket

### 11.2 Categorías de Pruebas
- **Componentes UI**: Verificación de renderizado y comportamiento
- **Hooks personalizados**: Validación de lógica de estado
- **Servicios**: Pruebas de comunicación con el backend
- **Lógica de juego**: Validación de movimientos, sugerencias y acusaciones
- **Comunicación socket**: Verificación de eventos y respuestas

### 11.3 Ejecución de Pruebas
```bash
# Ejecutar todas las pruebas frontend
cd frontend
npm test

# Ejecutar todas las pruebas backend
cd backend
npm test

# Ejecutar pruebas con informe de cobertura
npm run test:coverage

# Ejecutar pruebas en modo vigilancia
npm run test:watch
```

---

Esta documentación representa el estado final del proyecto Cluedo UNIZAR.