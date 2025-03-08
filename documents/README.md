# 🎲 Cluedo UNIZAR - Documentación del Proyecto


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
│   │   ├── pages/       # Páginas de la aplicación
│   │   │   ├── GameRoom/     # Interfaz de sala de juego
│   │   │   └── startGames/   # Creación/unión a partidas
│   │   ├── hooks/       # Custom React hooks
│   │   │   ├── useGameSocket.jsx  # Hook para gestionar sockets
│   │   │   └── useStartGames.jsx  # Hook para crear/unir partidas
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
│   │   ├── socket/       # Configuración de Socket.IO
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
- **Tablas principales**:
  - `user`: Almacena información de usuarios (username, email, password hashed)
- **Inicialización**: El script init.js crea la base de datos y tablas necesarias.


## 🔌 5. API REST

### 5.1 Endpoints de Usuario
- `POST /user/register`: Registro de nuevos usuarios
- `POST /user/login`: Autenticación de usuarios
- `POST /user/logout`: Cierre de sesión
- `POST /user/change-password`: Cambio de contraseña

### 5.2 Validación de Datos
- Todas las entradas son validadas mediante esquemas Zod.
- Manejo consistente de errores con mensajes descriptivos.


## 🖥️ 6. Frontend

### 6.1 Componentes Principales
- `Header`: Barra de navegación superior
- `Footer`: Pie de página
- `Home`: Página principal con secciones para características y reglas
- `Login/Register`: Formularios de autenticación
- `StartGames`: Interfaz para iniciar partidas

### 6.2 Hooks Personalizados
- `useIsMobile`: Detección de dispositivos móviles
- `useHeader`: Lógica para el encabezado responsivo
- `useLoginPage`: Manejo del formulario de login
- `useRegisterPage`: Manejo del formulario de registro
- `useStartGames`: Lógica para iniciar partidas

### 6.3 Estilos
- CSS modular por componente
- Variables CSS para temas consistentes
- Diseño responsivo para móviles y escritorio


## 🎮 7. Sistema de Partidas y Comunicación en Tiempo Real

### 7.1 Gestión de Partidas
- **Creación de partidas**: Generación de identificadores únicos (UUID)
- **Unión a partidas existentes**: Mediante código de partida
- **Persistencia en memoria**: Las partidas activas se mantienen en un Map centralizado (proximamente en base de datos)

### 7.2 Socket.IO
- **Arquitectura de comunicación**: Implementación de patrón publisher-subscriber
- **Autenticación de socket**: Mediante tokens JWT específicos para cada partida
- **Salas (rooms)**: Cada partida tiene su propia sala para comunicación aislada
- **Auto-limpieza**: Las partidas se eliminan automáticamente cuando quedan vacías
- **Reconexión**: Manejo de actualización de página y reconexiones
- **Eventos principales**:
  - `playerJoined`: Cuando un nuevo jugador se une a la partida
  - `playerLeft`: Cuando un jugador abandona la partida
  - `playerList`: Lista actualizada de jugadores en la sala
  - `leaveGame`: Abandono explícito de una partida


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
Las configuraciones se manejan mediante variables de entorno que se pueden definir en el archivo `.env` siguiendo la estructura del `.env.example`:
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

El proyecto requiere que se creen los archivos `.env` en la carpeta backend, siguiendo la estructura del `.env.example`

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

## 🔮 11. Consideraciones Futuras

- Implementación de Socket.IO para comunicación en tiempo real para el juego.
- Ampliación de características de juego (tablero, cartas, etc.).
- Mejora de sistemas de ranking y estadísticas.


---
Esta documentación es un recurso vivo que puede ser ampliado según evolucione el proyecto.
