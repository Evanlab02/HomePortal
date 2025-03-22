FROM caddy:2.9.1-alpine

RUN apk add --no-cache \
    nss-tools

COPY web/Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
