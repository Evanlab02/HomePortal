.PHONY: prep-pg15-pg16
prep-pg15-pg16:
	@echo "Preparing PostgreSQL 16..."
	@cp apps/pg15/.env apps/pg16/.env
	@echo "PostgreSQL 16 prepared successfully"

.PHONY: migrate-pg15-pg16
migrate-pg15-pg16:
	@echo "Migrating all databases to PostgreSQL 16..."
	@docker compose cp apps/files/data/backups/db/postgres/15/${ARGS} postgres-16:/tmp/backup.sql
	@docker compose exec -T postgres-16 psql -U postgres -f /tmp/backup.sql
	@echo "PostgreSQL 16 migrated successfully"

.PHONY: prep-pg16-pg17
prep-pg16-pg17:
	@echo "Preparing PostgreSQL 17..."
	@cp apps/pg16/.env apps/pg17/.env
	@echo "PostgreSQL 17 prepared successfully"

.PHONY: migrate-pg16-pg17
migrate-pg16-pg17:
	@echo "Migrating all databases to PostgreSQL 17..."
	@docker compose cp apps/files/data/backups/db/postgres/16/${ARGS} postgres-17:/tmp/backup.sql
	@docker compose exec -T postgres-17 psql -U postgres -f /tmp/backup.sql
	@echo "PostgreSQL 17 migrated successfully"
