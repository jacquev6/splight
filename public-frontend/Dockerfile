FROM node:11.9 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

RUN sed -i "s/splightApiUrl =.*/splightApiUrl = 'SED_BEFORE_RUN'/" public/index.html

RUN npm run build

FROM nginx:1.15.8-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

CMD sed -i "s|splightApiUrl = 'SED_BEFORE_RUN'|splightApiUrl = '$SPLIGHT_API_URL'|" /usr/share/nginx/html/index.html && nginx -g 'daemon off;'
