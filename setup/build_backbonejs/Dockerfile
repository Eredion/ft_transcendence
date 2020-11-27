FROM nginx:alpine

RUN apk -U upgrade

WORKDIR /transcendence

COPY nginx.conf /etc/nginx/nginx.conf

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["sh", "/entrypoint.sh"]
