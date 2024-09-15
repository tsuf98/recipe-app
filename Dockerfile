# Base image for building the frontend
FROM node:21-alpine AS build-frontend

WORKDIR /app/client

COPY client/package*.json ./

RUN npm install

COPY client/ .

RUN npm run build

# Base image for building the backend
FROM node:21-alpine AS build-backend

WORKDIR /app/server

COPY server/package*.json ./


RUN npm install

COPY server/ .

# Copy the built frontend from the build-frontend stage
COPY --from=build-frontend /app/client/dist /app/client/dist

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
