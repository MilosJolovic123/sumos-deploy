# Stage 1: Build okruženje
FROM node:20-alpine AS build
WORKDIR /app

# OBAVEZNO: Hvatanje adrese API-ja pre izvršavanja build komande
ARG VITE_API_HOST
ENV VITE_API_HOST=$VITE_API_HOST

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Nginx server
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Kopiranje tvog prilagođenog fajla koji već ima try_files
COPY nginx.conf /etc/nginx/conf.d/default.conf

#EXPOSE 80 ovo ce da bude za prod server

# Ovo je port koji koristi Vite dev server, ali u produkciji ćeš koristiti Nginx na portu 80
EXPOSE 5173 
CMD ["nginx", "-g", "daemon off;"]