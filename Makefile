include .env
export

include misc/backup.mk
include misc/caddy.mk
include misc/docker.mk
include misc/elastic.mk
include misc/env.mk
include misc/maintenance.mk
include misc/migrate.mk
include misc/notify.mk

.PHONY: port
port:
	docker compose exec gluetun cat /tmp/gluetun/forwarded_port


.PHONY: start-1
start-1:
	docker compose up -d elasticsearch kibana logstash
	docker compose logs -f

.PHONY: start-2
start-2: up
