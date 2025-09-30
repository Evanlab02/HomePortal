.PHONY: init
init:
	cp .env.template .env
	sed -i 's/SHOPPING_DJANGO_KEY=/SHOPPING_DJANGO_KEY=$(shell pwgen -s 96 1)/' .env
	sed -i 's/SHOPPING_DATABASE_PASSWORD=/SHOPPING_DATABASE_PASSWORD=$(shell pwgen -s 96 1)/' .env
