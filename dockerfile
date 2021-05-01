FROM node:lts-alpine as build-stage
WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

RUN yarn install \
    --prefer-offline \
    --frozen-lockfile \
    --non-interactive

COPY . .
RUN yarn build

ARG PORT
ENV PORT=${PORT}
ENV NODE_ENV=production

EXPOSE ${PORT}
CMD [ "yarn", "serve" ]