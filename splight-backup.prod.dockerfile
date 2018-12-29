FROM node:10-alpine

RUN apk --update add mongodb-tools && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY splight ./splight

COPY jacquev6-0001-430328cf0505.json ./

CMD node splight/backup.js
