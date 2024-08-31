FROM node:20-alpine3.19

WORKDIR /app

RUN apk update && apk upgrade && apk add git && apk add bash

COPY ./package.json ./yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

RUN npm install sequelize-cli

CMD sh -c "npm rebuild esbuild && yarn migrate && yarn dev"