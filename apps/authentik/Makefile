.PHONY: init
init:
	cp .env.template .env
	sed -i 's/AUTHENTIK_POSTGRESQL__PASSWORD=/AUTHENTIK_POSTGRESQL__PASSWORD=$(shell pwgen -s 96 1)/' .env
	sed -i 's/AUTHENTIK_SECRET_KEY=/AUTHENTIK_SECRET_KEY=$(shell pwgen -s 96 1)/' .env
