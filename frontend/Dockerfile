# Fase di build
FROM node:16 AS build

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il resto
COPY . .

# Compila il progetto
RUN npm run build

# Fase di runtime
FROM nginx:alpine

# Copia il build del frontend dalla fase di build
COPY --from=build /app/build /usr/share/nginx/html

# Espone la porta 80 per Nginx
EXPOSE 80

# Avvia Nginx
CMD ["nginx", "-g", "daemon off;"]
