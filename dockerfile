# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .


ARG VUE_APP_API_URL
ARG VUE_APP_MONO_PUBLIC_KEY
ARG VUE_APP_VAPID_PUBLIC_KEY
ENV VUE_APP_API_URL=${VUE_APP_API_URL}
ENV VUE_APP_MONO_PUBLIC_KEY=${VUE_APP_MONO_PUBLIC_KEY}
ENV VUE_APP_VAPID_PUBLIC_KEY=${VUE_APP_VAPID_PUBLIC_KEY}

RUN yarn build

# production stage
FROM socialengine/nginx-spa:latest as production-stage
COPY --from=build-stage /app/dist /app
RUN chmod -R 777 /app
EXPOSE 80