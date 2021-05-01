FROM node:lts-alpine as build-stage
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN yarn build

ARG PORT
ENV PORT=${PORT}

EXPOSE ${PORT}
CMD [ "yarn", "serve" ]