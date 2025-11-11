include .env
export

include misc/backup.mk
include misc/caddy.mk
include misc/docker.mk
include misc/elastic.mk
include misc/maintenance.mk

.PHONY: superuser
superuser:
	docker compose exec hp-2-admin python manage.py createsuperuser
