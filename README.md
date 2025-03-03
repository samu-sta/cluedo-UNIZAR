# 🕵️‍♂️ Proyecto Cluedo Digital 🕵️‍♀️
![2e63ac96-9857-4a3a-8e93-e7e914b19870](https://github.com/user-attachments/assets/1eef4e71-44a8-4617-bf51-4532baa18a5a)


## 📜 Descripción

¡Resuelve el misterio en línea! 🔍 Este proyecto reimagina el clásico juego de mesa Cluedo, permitiendo a jugadores de todo el mundo unirse y desentrañar el caso juntos. 🤝

## 🛠️ Tecnologías Utilizadas

*   **Frontend:**
    *   ⚛️ **React 19:** La biblioteca de JavaScript líder para construir interfaces de usuario interactivas.
    *   🔌 **Socket.IO Client:** Para una comunicación bidireccional en tiempo real con el backend.
*   **Backend:**
    *   ⚙️ **Node.js:** El entorno de ejecución de JavaScript del lado del servidor.
    *   🚀 **Express:** Un framework web minimalista y flexible para Node.js.
    *   🔗 **Socket.IO:** Facilita la comunicación en tiempo real entre el servidor y los clientes.
    *   🔑 **JSON Web Tokens (JWT):** Para una autenticación segura y basada en tokens.
    *   🗄️ **Sequelize:** ORM (Object-Relational Mapper) para interactuar con la base de datos MySQL.
    *   🐬 **MySQL:** El sistema de gestión de bases de datos relacional.

## 📂 Estructura del Proyecto
```
cluedo/
├── frontend/     # Código fuente del frontend (React)
├── backend/      # Código fuente del backend (Node.js, Express)
├── .env.example  # Archivo de ejemplo para la configuración
├── README.md     # Este archivo
```

## ⚙️ Instalación

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/samu-sta/cluedo-UNIZAR
    cd cluedo-UNIZAR
    ```

2.  **Configura el backend:**

    ```bash
    cd backend
    pnpm install
    cp .env.example .env
    # ✏️ Edita el archivo .env con tus credenciales de base de datos y clave secreta JWT
    ```

3.  **Configura el frontend:**

    ```bash
    cd ../frontend
    pnpm install
    ```

## 🚀 Ejecución

1.  **Inicia la base de datos MySQL:** Asegúrate de que tu servidor MySQL esté en ejecución. ⚙️

2.  **Inicia el backend:**

    ```bash
    cd backend
    pnpm run dev
    ```

3.  **Inicia el frontend:**

    ```bash
    cd ../frontend
    pnpm run dev
    ```
## 🐳 Docker

```bash

# Crear el archivo de variables de entorno:
cp .env.example .env

# Construir y levantar todos los contenedores
docker compose up --build

# Para ejecutar en segundo plano
docker compose up -d --build

# Para ver logs cuando se ejecuta en segundo plano
docker compose logs -f
```


## 🔑 Autenticación

El sistema utiliza **JWT** para la autenticación de usuarios. 🔐

## 💬 Socket.IO

Implementa comunicación en tiempo real para el juego.

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature/bugfix
3. Escribir pruebas
4. Pull request

## 📜 Licencia

Este proyecto está licenciado bajo la Licencia MIT
