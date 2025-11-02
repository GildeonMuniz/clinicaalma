# Etapa 1 - Build do Vue.js
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY client/package*.json ./client/
RUN cd client && npm install
COPY . .
RUN cd client && npm run build

# Etapa 2 - Servidor Nginx
FROM nginx:1.27-alpine
COPY --from=build /app/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
