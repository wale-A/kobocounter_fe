
# # build stage
# FROM node:lts-alpine as build-stage
# WORKDIR /app
# # COPY package*.json ./

# # COPY package*.json ./
# # COPY tsconfig.json ./

# COPY . .

# # RUN npm i -g typescript
# RUN npm install --legacy-peer-deps
# RUN npm run build

# ARG VITE_MONO_PUBLIC_KEY
# ARG VITE_VAPID_PUBLIC_KEY
# ARG VITE_AM4_LICENSE
# ARG VITE_PORT
# ARG VITE_API_URL

# ENV VITE_MONO_PUBLIC_KEY=${VITE_MONO_PUBLIC_KEY}
# ENV VITE_VAPID_PUBLIC_KEY=${VITE_VAPID_PUBLIC_KEY}
# ENV VITE_AM4_LICENSE=${VITE_AM4_LICENSE}
# ENV VITE_PORT=${VITE_PORT}
# ENV VITE_API_URL=${VITE_API_URL}

# RUN npm run build

# # production stage
# FROM socialengine/nginx-spa:latest as production-stage
# COPY --from=build-stage /app/dist /app
# RUN chmod -R 777 /app

# EXPOSE 3000
# RUN [ "npm", "run", "serve" ]


# FROM node:lts-alpine
FROM tarampampam/node:16-alpine
# FROM node:16-alpine
# install simple http server for serving static content
# RUN npm install -g http-server

# RUN apt update
# RUN apt install -y git

# make the 'app' folder the current working directory
WORKDIR /app
# copy 'package.json' to install dependencies
COPY package*.json ./
# install dependencies
# RUN ls
RUN npm i -g typescript
# RUN set NODE_OPTIONS=--openssl-legacy-provider
RUN npm install --legacy-peer-deps
# RUN yarn
# copy files and folders to the current working directory (i.e. 'app' folder)
COPY . .
# build app for production with minification
RUN npm run build

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

# RUN chmod -R 777 /app

EXPOSE 30000
# RUN npm run serve -- --host
CMD [ "npm", "run serve -- --host" ]