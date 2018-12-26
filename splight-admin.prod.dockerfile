FROM node:10-alpine

RUN apk --update add git openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

COPY ssh /root/.ssh
RUN git config --global user.email "francoisjacques@wanadoo.fr"
RUN git config --global user.name "François Jacques"

RUN ssh git@bitbucket.org | grep "logged in as Francoisjacques55"

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

EXPOSE 80

COPY splight ./splight

CMD node splight/serveLongRunningWebsite.js git@bitbucket.org:jacquev6/splight.fr-data.git
