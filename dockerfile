# build stage
FROM node:lts-alpine as build-stage
RUN npm i -g http-server
WORKDIR /app

COPY package*.json yarn.lock tsconfig.json ./

RUN yarn install 
COPY . .
RUN yarn build

ARG PORT
ENV PORT=${PORT}
ENV NODE_ENV=production

EXPOSE ${PORT}
CMD [ "http-server", "dist" ]