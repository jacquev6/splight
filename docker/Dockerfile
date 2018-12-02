FROM node:10-alpine

WORKDIR /splight

COPY src/package.json src/package-lock.json ./

RUN npm install --production

EXPOSE 80

COPY src/splight ./splight
COPY src/serveLongRunningWebsite.js ./serve.js

CMD node serve.js $SPLIGHT_DATA
