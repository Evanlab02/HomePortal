.PHONY: init
init:
	cp .env.template .env
	sed -i 's/IMMICH_DB_PASSWORD=/IMMICH_DB_PASSWORD=$(shell pwgen -s 96 1)/' .env
	