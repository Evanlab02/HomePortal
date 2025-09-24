.PHONY: init
init:
	cp .env.template .env
	sed -i 's/PASSWORD=/PASSWORD=$(shell pwgen -s 96 1)/' .env