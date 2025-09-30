.env:
	@echo "Generating .env file with random password..."
	@cp .env.template .env
	@sed -i 's/DB_PASSWORD=/DB_PASSWORD=$(shell pwgen -s 96 1)/' .env
	@echo ".env file created successfully"

.PHONY: init
init: .env
