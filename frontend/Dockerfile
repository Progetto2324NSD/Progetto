# Usa un'immagine Node.js ufficiale
FROM node:16

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il contenuto del frontend
COPY . .

# Compila il progetto
RUN npm run build

# Usa un server Nginx per servire il frontend
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Espone la porta 80 per Nginx
EXPOSE 80

# Avvia Nginx
CMD ["nginx", "-g", "daemon off;"]
