FROM node:10-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

RUN apk --update add mongodb-tools && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

COPY splight ./splight

COPY jacquev6-0001-430328cf0505.json ./

ENTRYPOINT ["node", "splight/backup.js"]
