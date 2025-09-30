.PHONY: backup-pg15
backup-pg15:
	@echo "Backing up all databases..."
	@docker compose exec -T postgres-15 pg_dumpall -U postgres > apps/files/data/backups/db/postgres/15/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Backup completed successfully"
