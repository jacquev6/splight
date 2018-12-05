FROM node:10-alpine

RUN apk --update add git openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

COPY src/papa-on-gcp.id_rsa /root/.ssh/id_rsa
COPY src/papa-on-gcp.id_rsa.pub /root/.ssh/id_rsa.pub
COPY ssh-config /root/.ssh/config
RUN git config --global user.email "francoisjacques@wanadoo.fr"
RUN git config --global user.name "François Jacques"

RUN ssh git@bitbucket.org | grep "logged in as Francoisjacques55"

WORKDIR /splight

COPY src/package.json src/package-lock.json ./

RUN npm install --production

EXPOSE 80

COPY src/splight ./splight
COPY src/serveLongRunningWebsite.js ./serve.js

CMD node serve.js git@bitbucket.org:jacquev6/splight.fr-data.git
