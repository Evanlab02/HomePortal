.PHONY: init
init:
	cp .env.template .env
	sed -i 's/PIHOLE_PASSWORD=/PIHOLE_PASSWORD=$(shell pwgen -s 96 1)/' .env
