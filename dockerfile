# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=${VUE_APP_API_URL}

RUN npm run build

# production stage
FROM socialengine/nginx-spa:latest as production-stage
COPY --from=build-stage /app/dist /app
RUN chmod -R 777 /app
EXPOSE 80