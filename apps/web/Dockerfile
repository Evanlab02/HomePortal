FROM caddy:2.10.2-alpine

COPY Caddyfile /etc/caddy/Caddyfile

COPY --from=ghcr.io/evanlab02/shopping-web:0.18.1 /var/www/html/static/ /var/www/html/shopping/static/
COPY --from=ghcr.io/evanlab02/shopping-web:0.18.1 /var/www/html/docs/   /var/www/html/shopping/docs/

EXPOSE 80
