FROM caddy:2.9.1-alpine

COPY web/Caddyfile /etc/caddy/Caddyfile
COPY certs/homeportal.pem /etc/caddy/certs/homeportal.pem
COPY certs/homeportal.key.pem /etc/caddy/certs/homeportal.key.pem
COPY public/ /var/www/public/
EXPOSE 80
