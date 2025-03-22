FROM caddy:2.9.1-alpine

RUN apk add --no-cache \
    ca-certificates \
    curl \
    libcap \
    libcap-ng \
    libgcc \
    libnss3-tools

COPY web/Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
