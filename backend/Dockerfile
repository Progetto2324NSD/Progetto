# Usa un'immagine Node.js ufficiale
FROM node:16

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il contenuto del backend
COPY . .

# Espone la porta su cui gira il backend
EXPOSE 5000

# Avvia il server
CMD ["npm", "start"]
