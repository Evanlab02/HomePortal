.PHONY: caddy-fmt
caddy-fmt:
	docker exec -it hp-web caddy fmt /etc/caddy/Caddyfile --overwrite

.PHONY: up
up:
	docker compose up -d

.PHONY: down
down:
	docker compose down

.PHONY: debug
debug:
	docker compose up

.PHONY: build
build:
	docker compose build

.PHONY: pull
pull:
	docker compose pull

.PHONY: logs
logs:
	docker compose logs -f

.PHONY: restart
restart:
	docker compose restart

images:
	mkdir -p images

.env:
	cp .env.template .env

certs:
	mkdir -p certs

certs/homeportal.key.pem:
	cd certs && mkcert -key-file homeportal.key.pem --cert-file homeportal.pem *.portal.tech portal.tech 192.168.0.2 localhost

public:
	mkdir -p public

public/certs:
	mkdir -p public/certs

public/certs/rootCA.crt:
	cp $(shell mkcert -CAROOT)/rootCA.pem public/certs/rootCA.crt

.PHONY: init
init: images .env certs certs/homeportal.key.pem public public/certs public/certs/rootCA.crt

.PHONY: where-is-root
where-is-root:
	mkcert -CAROOT
