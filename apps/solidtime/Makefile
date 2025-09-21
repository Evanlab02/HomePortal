env/app.env:
	cp env/app.template.env env/app.env

.PHONY: generate-keys
generate-keys:
	docker compose run scheduler php artisan self-host:generate-keys
