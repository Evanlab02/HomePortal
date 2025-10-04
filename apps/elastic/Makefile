.env:
	@echo "Generating .env file with random password..."
	@cp .env.template .env
	@sed -i 's/ELASTIC_PASSWORD=/ELASTIC_PASSWORD=$(shell pwgen -s 96 1)/' .env
	@echo ".env file created successfully"

.PHONY: init
init: .env