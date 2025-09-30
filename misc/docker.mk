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