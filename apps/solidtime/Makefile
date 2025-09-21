env/app.env:
	cp env/app.env.template env/app.env

.PHONY: generate-keys
generate-keys:
	docker compose run scheduler php artisan self-host:generate-keys
