.PHONY: migrate-env-pg15-pg16
migrate-env-pg15-pg16:
	@echo "Migrating environment variables for apps using PostgreSQL 15 to PostgreSQL 16..."
	@sed -i apps/solidtime/env/app.env -e 's/DB_HOST="hp-postgres-15"/DB_HOST="hp-postgres-16"/'
	@sed -i apps/authentik/.env -e 's/AUTHENTIK_POSTGRESQL__HOST=hp-postgres-15/AUTHENTIK_POSTGRESQL__HOST=hp-postgres-16/'
	@sed -i apps/shopping/.env -e 's/SHOPPING_DB_HOST=hp-postgres-15/SHOPPING_DB_HOST=hp-postgres-16/'
	@echo "Environment variables migrated successfully"
