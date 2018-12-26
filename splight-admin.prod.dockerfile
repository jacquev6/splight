FROM node:10-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

EXPOSE 80

COPY splight ./splight

CMD node splight/serveLongRunningWebsite.js
