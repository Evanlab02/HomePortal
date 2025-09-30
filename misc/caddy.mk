.PHONY: caddy-fmt
caddy-fmt:
	docker run --rm -v `pwd`/apps/web/conf/Caddyfile:/etc/caddy/Caddyfile caddy:2.10.2-alpine caddy fmt /etc/caddy/Caddyfile --overwrite