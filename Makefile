include .env
export

.PHONY: caddy-fmt
caddy-fmt:
	docker run --rm -v `pwd`/apps/web/Caddyfile:/etc/caddy/Caddyfile caddy:2.10.2-alpine caddy fmt /etc/caddy/Caddyfile --overwrite

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

.PHONY: reboot
reboot:
	./scripts/reboot.sh --auth $(NTFY_TOKEN)

.PHONY: testing
testing:
	./scripts/testing.sh --auth $(NTFY_TOKEN)

.PHONY: update
update:
	./scripts/update.sh --auth $(NTFY_TOKEN)

.PHONY: shutdown
shutdown:
	./scripts/shutdown.sh --auth $(NTFY_TOKEN)

.PHONY: upgrade
upgrade:
	./scripts/upgrade.sh --auth $(NTFY_TOKEN)

.PHONY: ntfy
ntfy:
	docker compose exec ntfy ntfy ${ARGS}

.PHONY: notify
notify:
	docker compose exec ntfy ntfy pub -p ${PRIORITY} --tags warning https://ntfy.labuschagne.xyz/hp-all ${MESSAGE}
