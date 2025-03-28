# 🎲 Cluedo UNIZAR - Documentación del Proyecto (Actualizada)

> [!NOTE]
> Esta documentación refleja el estado actual del proyecto a día 28 de marzo de 2025. Contiene información detallada sobre la arquitectura, componentes y funcionalidades implementadas.

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
- **CORS**: Middleware para habilitar peticiones entre dominios
- **Morgan 1.10.0**: Logger de HTTP requests
- **Dotenv 16.4.7**: Carga variables de entorno desde archivo .env
- **Zod 3.24.2**: Validación de datos de entrada de peticiones HTTP
- **UUID 10.0.0**: Generación de identificadores únicos para partidas


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
│   │   │   └── startGames/   # Creación/unión a partidas
│   │   ├── hooks/       # Custom React hooks
│   │   │   ├── useGameSocket.jsx  # Hook para gestionar sockets
│   │   │   ├── useDeductions.jsx  # Hook para la tabla de deducciones
│   │   │   └── useIsMobile.jsx    # Hook para detectar dispositivos móviles
│   │   ├── services/    # Servicios para API calls
│   │   │   ├── Game.js          # Servicios de partidas
│   │   │   └── Socket.js        # Configuración de Socket.IO
│   │   └── schemas/     # Esquemas de validación
│   └── ...
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
│   │   │   ├── GameStateManager.js  # Gestión del estado de juego
│   │   │   └── CountdownManager.js  # Gestión de cuenta regresiva
│   │   ├── config/       # Configuraciones del juego
│   │   │   └── gameConstants.js    # Constantes para el tablero y cartas
│   │   ├── utils/        # Utilidades del juego
│   │   │   └── board.js           # Algoritmos de movimiento en el tablero
│   │   └── schemas/      # Esquemas para validación
│   └── ...
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
  - Cambio de contraseña (`/user/change-password`)
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
  - `AdminModel`: Establece relación con Account para administradores
  - `GameModel`: Información básica del juego
  - `BoardModel`: Configuración del tablero (filas, columnas)
  - `RoomModel`: Habitaciones del tablero de juego
  - `WallModel`: Representa las paredes en las habitaciones
  - `DoorModel`: Representa las puertas entre habitaciones
  - `CardModel`: Cartas del juego (armas, personajes, habitaciones)
- **Relaciones**:
  - Account → User/Admin (one-to-one)
  - Game → Board (one-to-one)
  - Game → Card (one-to-many)
  - Board → Room (one-to-many)
  - Room → Wall (one-to-many)
  - Room → Door (one-to-many)
- **Inicialización**: El script init.js crea la base de datos y tablas necesarias.

> [!TIP]
> Para facilitar el desarrollo, se puede utilizar la herramienta MySQL Workbench para visualizar y manipular la estructura de la base de datos directamente.


## 🔌 5. API REST

### 5.1 Endpoints de Usuario
- `POST /user/register`: Registro de nuevos usuarios
- `POST /user/login`: Autenticación de usuarios
- `POST /user/logout`: Cierre de sesión
- `POST /user/change-password`: Cambio de contraseña

### 5.2 Endpoints de Juego
- `POST /game/create`: Creación de una nueva partida
- `POST /game/join/:gameId`: Unirse a una partida existente

### 5.3 Validación de Datos
- Todas las entradas son validadas mediante esquemas Zod.
- Manejo consistente de errores con mensajes descriptivos.

> [!WARNING]
> No se debe omitir la validación de ningún dato de entrada, ya que esto podría comprometer la seguridad de la aplicación y crear vulnerabilidades.


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

### 6.2 Hooks Personalizados
- `useIsMobile`: Detección de dispositivos móviles
- `useHeader`: Lógica para el encabezado responsivo
- `useLoginPage`: Manejo del formulario de login
- `useRegisterPage`: Manejo del formulario de registro
- `useStartGames`: Lógica para iniciar partidas
- `useGameSocket`: Gestión de la comunicación socket durante la partida
- `useDeductions`: Estado y lógica para la tabla de deducciones
- `useGameEndedModal`: Control del modal de fin de partida

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

> [!IMPORTANT]
> Nunca incluir archivos .env con credenciales reales en el repositorio. Asegurarse de que estén incluidos en el .gitignore.

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

> [!WARNING]
> Establecer un JWT_SECRET privado que no se pueda descifrar


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

> [!NOTE]
> El proyecto requiere que se creen los archivos .env en la carpeta backend, siguiendo la estructura del .env.example.

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

## 📷 11. Capturas de Pantalla

### 11.1 Página de Inicio
![home-1](https://github.com/user-attachments/assets/526330b3-b676-40ed-a988-379921742dd4)
![home-2](https://github.com/user-attachments/assets/78563d1c-2d44-46c4-9465-d622b74a9f73)
![home-3](https://github.com/user-attachments/assets/876bd374-8307-429c-9a41-dc619cf7f206)
![home-4](https://github.com/user-attachments/assets/d8211a83-abfc-4089-9270-d6744c5f5000)

### 11.2 Interfaz de Juego
![game-1](https://github.com/user-attachments/assets/54e4fa6d-9fc3-4f35-8561-4155fa812c71)
![game-2](https://github.com/user-attachments/assets/ebba0655-37eb-42bf-8bb0-3712b18606c1)
![game-3](https://github.com/user-attachments/assets/3e586cc5-7e48-47d3-88be-c0dbc8a4943a)

## 🔮 12. Consideraciones Futuras

- Implementación de lógica completa de juego con acusaciones
- Sistema de acusaciones y suposiciones
- Modulo administrador permitiendo el C.R.U.D de usuarios y partidas

---
Esta documentación es un recurso vivo que puede ser ampliado según evolucione el proyecto.
