.PHONY: init
init:
	cp .env.template .env
	sed -i 's/PGADMIN_DEFAULT_PASSWORD=/PGADMIN_DEFAULT_PASSWORD=$(shell pwgen -s 96 1)/' .env
