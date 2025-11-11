FROM caddy:2.10.2-alpine

COPY conf/Caddyfile /etc/caddy/Caddyfile
COPY --from=ghcr.io/evanlab02/hp2-caddy:0.6.3 /var/www/html/homeportal/static/ /var/www/html/homeportal/static/

EXPOSE 80
