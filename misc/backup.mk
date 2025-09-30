.PHONY: backup-pg15
backup-pg15:
	@echo "Backing up database..."
	@docker compose exec -T postgres-15 pg_dump -U postgres -d postgres -F c > apps/files/data/backups/db/postgres/15/backup_$(shell date +%Y%m%d_%H%M%S).dump
	@echo "Backup completed successfully"
