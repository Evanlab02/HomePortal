FROM caddy:2.10.2-alpine

COPY web/Caddyfile /etc/caddy/Caddyfile
COPY certs/homeportal.pem /etc/caddy/certs/homeportal.pem
COPY certs/homeportal.key.pem /etc/caddy/certs/homeportal.key.pem
COPY public/ /var/www/public/

COPY --from=ghcr.io/evanlab02/shopping-web:0.18.1 /var/www/html/static/ /var/www/html/shopping/static/
COPY --from=ghcr.io/evanlab02/shopping-web:0.18.1 /var/www/html/docs/   /var/www/html/shopping/docs/

EXPOSE 80
