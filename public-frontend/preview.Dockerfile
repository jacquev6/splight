FROM node:11.9 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY public public

RUN sed -i "s/splightApiUrl =.*/splightApiUrl = 'SED_BEFORE_RUN'/" public/index.html

COPY src src

COPY vue.config.js ./
# ENV BASE_URL /preview/

RUN npm run build


FROM nginx:1.15.8-alpine

COPY nginx.conf /etc/nginx/

COPY --from=builder /app/dist /usr/share/nginx/html/preview/

CMD sed -i "s|splightApiUrl = 'SED_BEFORE_RUN'|splightApiUrl = '$SPLIGHT_API_URL'|" /usr/share/nginx/html/preview/index.html && nginx -g 'daemon off;'
