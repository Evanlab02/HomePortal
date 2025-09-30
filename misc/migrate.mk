.PHONY: prep-pg15-pg16
prep-pg15-pg16:
	@echo "Preparing PostgreSQL 16..."
	@cp apps/pg15/.env apps/pg16/.env
	@echo "PostgreSQL 16 prepared successfully"

.PHONY: migrate-pg15-pg16
migrate-pg15-pg16:
	@echo "Migrating PostgreSQL 16..."
	@docker compose exec -T postgres-16 pg_restore -U postgres -d postgres -1 apps/files/data/backups/db/postgres/15/${ARGS}
	@echo "PostgreSQL 16 migrated successfully"
