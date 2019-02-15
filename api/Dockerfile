FROM node:11.9

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . ./

EXPOSE 80

CMD ["node", "serveLongRunningWebsite.js"]
