# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
# COPY package*.json ./
COPY . .
RUN npm i  --legacy-peer-deps

ARG VITE_MONO_PUBLIC_KEY
ARG VITE_VAPID_PUBLIC_KEY
ARG VITE_AM4_LICENSE
ARG VITE_PORT
ARG VITE_API_URL

ENV VITE_MONO_PUBLIC_KEY=${VITE_MONO_PUBLIC_KEY}
ENV VITE_VAPID_PUBLIC_KEY=${VITE_VAPID_PUBLIC_KEY}
ENV VITE_AM4_LICENSE=${VITE_AM4_LICENSE}
ENV VITE_PORT=${VITE_PORT}
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# production stage
FROM socialengine/nginx-spa:latest as production-stage
COPY --from=build-stage /app/dist /app
RUN chmod -R 777 /app
EXPOSE 80