FROM node:20-alpine3.19

WORKDIR /app

RUN apk update && apk upgrade && apk add git && apk add bash

COPY ./package.json ./

RUN npm install

COPY . .

EXPOSE 3000


CMD [ "npm", "run", "dev" ]