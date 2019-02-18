FROM node:11.9 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY public public

RUN sed -i "s/splightApiUrl =.*/splightApiUrl = 'SED_BEFORE_RUN'/" public/index.html

COPY src src

COPY public.vue.config.js vue.config.js
# ENV BASE_URL /preview/

RUN npm run build


FROM nginx:1.15.8-alpine

COPY public.nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html/

CMD sed -i "s|splightApiUrl = 'SED_BEFORE_RUN'|splightApiUrl = '$SPLIGHT_API_URL'|" /usr/share/nginx/html/index.html && nginx -g 'daemon off;'
