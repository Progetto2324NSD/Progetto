# Fase 1: Build
FROM node:16 AS build

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di configurazione
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il resto
COPY . .

# Costruisci il progetto
RUN npm run build

# Fase 2: Serve
FROM nginx:alpine

# Copia i file buildati dal contesto di build
COPY --from=build /app/build /usr/share/nginx/html

# Espone la porta 80
EXPOSE 80

# Avvia Nginx
CMD ["nginx", "-g", "daemon off;"]
