FROM node:20-alpine3.19

RUN mkdir /app

WORKDIR /app

RUN apk update && apk upgrade && apk add git && apk add bash

# RUN rm -rf ./node_modules
RUN rm -rf package-lock.json

COPY ./package.json ./package-lock.json ./

RUN npm ci

COPY . .

CMD ["npm", "run", "dev"]