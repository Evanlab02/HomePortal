.PHONY: reboot
reboot:
	./scripts/reboot.sh --auth $(NTFY_TOKEN)

.PHONY: testing
testing:
	./scripts/testing.sh --auth $(NTFY_TOKEN)

.PHONY: update
update:
	./scripts/update.sh --auth $(NTFY_TOKEN)

.PHONY: shutdown
shutdown:
	./scripts/shutdown.sh --auth $(NTFY_TOKEN)

.PHONY: upgrade
upgrade:
	./scripts/upgrade.sh --auth $(NTFY_TOKEN)