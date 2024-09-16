# Usa l'immagine di base
FROM node:16

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di configurazione
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il resto
COPY . .

# Aggiungi permessi di esecuzione per nodemon
RUN npm install -g nodemon

EXPOSE 5000

# Comando di avvio
CMD ["nodemon", "index.js"]
