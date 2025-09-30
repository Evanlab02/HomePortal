.PHONY: migrate-env-pg15-pg16
migrate-env-pg15-pg16:
	@echo "Migrating environment variables for apps using PostgreSQL 15 to PostgreSQL 16..."
	@sed -i apps/solidtime/env/app.env -e 's/DB_HOST="hp-postgres-15"/DB_HOST="hp-postgres-16"/'
	@sed -i apps/authentik/.env -e 's/AUTHENTIK_POSTGRESQL__HOST=hp-postgres-15/AUTHENTIK_POSTGRESQL__HOST=hp-postgres-16/'
	@sed -i apps/shopping/.env -e 's/SHOPPING_DB_HOST=hp-postgres-15/SHOPPING_DB_HOST=hp-postgres-16/'
	@echo "Environment variables migrated successfully"

.PHONY: migrate-env-pg16-pg17
migrate-env-pg16-pg17:
	@echo "Migrating environment variables for apps using PostgreSQL 16 to PostgreSQL 17..."
	@sed -i apps/solidtime/env/app.env -e 's/DB_HOST="hp-postgres-16"/DB_HOST="hp-postgres-17"/'
	@sed -i apps/authentik/.env -e 's/AUTHENTIK_POSTGRESQL__HOST=hp-postgres-16/AUTHENTIK_POSTGRESQL__HOST=hp-postgres-17/'
	@sed -i apps/shopping/.env -e 's/SHOPPING_DB_HOST=hp-postgres-16/SHOPPING_DB_HOST=hp-postgres-17/'
	@echo "Environment variables migrated successfully"

.PHONY: migrate-env-redis7-valkey8
migrate-env-redis7-valkey8:
	@echo "Migrating environment variables for apps using Redis 7 to Valkey 8..."
	@sed -i apps/authentik/.env -e 's/AUTHENTIK_REDIS__HOST=hp-redis-7/AUTHENTIK_REDIS__HOST=hp-valkey8/'
	@sed -i apps/shopping/.env -e 's/SHOPPING_REDIS_HOST=hp-redis-7/SHOPPING_REDIS_HOST=hp-valkey8/'
	@echo "Environment variables migrated successfully"