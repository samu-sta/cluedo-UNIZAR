FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Exponer puerto
EXPOSE 5173

# Comando para desarrollo con --host para exponer la red
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]