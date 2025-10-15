.PHONY: backup-sql-db
backup-sql-db:
	@echo "Backing up all databases..."
	@docker compose exec -T postgres-17 pg_dumpall -U postgres > apps/files/data/backups/db/postgres/17/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Backup completed successfully"
