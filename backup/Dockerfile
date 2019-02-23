FROM node:11.9-alpine
# Based on Alpine 3.8, so we get mongodb-tools 3.6

RUN apk --no-cache add mongodb-tools

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY src src

ENTRYPOINT ["node", "src/backup.js"]

CMD ["backup"]
