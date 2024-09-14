# Usa un'immagine Node.js ufficiale
FROM node:16

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice
COPY . .

# Espone la porta su cui il server ascolta (modifica se necessario)
EXPOSE 5000

# Comando di avvio
CMD ["node", "index.js"]
