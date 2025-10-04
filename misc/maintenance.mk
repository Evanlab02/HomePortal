.PHONY: back-to-normal
back-to-normal:
	@echo "Sending back to normal notification..."
	@docker compose exec ntfy ntfy pub \
		-u $(NTFY_USER):$(NTFY_PW) \
		--title "Server is back to normal" \
		--priority default \
		--tags computer,dizzy_face,success \
		--message "..." \
		https://ntfy.labuschagne.xyz/maintenance
	@echo "Sent back to normal notification"
	@echo "Done"

.PHONY: reboot
reboot:
	@echo "Sending reboot notification..."
	@docker compose exec ntfy ntfy pub \
		-u $(NTFY_USER):$(NTFY_PW) \
		--title "Rebooting!" \
		--priority high \
		--tags computer,warning \
		--message "The server is restarting in 1 minute..." \
		https://ntfy.labuschagne.xyz/maintenance
	@echo "Sent reboot notification"
	@echo "Scheduling reboot"
	@sudo shutdown -r +1
	@echo "Reboot scheduled"
	@echo "Done"

.PHONY: shutdown
shutdown:
	@echo "Sending shutdown notification..."
	@docker compose exec ntfy ntfy pub \
		-u $(NTFY_USER):$(NTFY_PW) \
		--title "Shutting down!" \
		--priority high \
		--tags sleeping,power,warning \
		--message "The server is shutting down in 1 minute..." \
		https://ntfy.labuschagne.xyz/maintenance
	@echo "Sent shutdown notification"
	@echo "Scheduling shutdown"
	@sudo shutdown +1
	@echo "Shutdown scheduled"
	@echo "Done"

.PHONY: unstable
unstable:
	@echo "Sending unstable notification..."
	@docker compose exec ntfy ntfy pub \
		-u $(NTFY_USER):$(NTFY_PW) \
		--title "The server is undergoing active work and testing." \
		--priority high \
		--tags warning \
		--message "Server quality might be degraded during this period." \
		https://ntfy.labuschagne.xyz/maintenance
	@echo "Sent unstable notification"
	@echo "Done"

.PHONY: maintenance
maintenance:
	@echo "Sending maintenance notification..."
	@docker compose exec ntfy ntfy pub \
		-u $(NTFY_USER):$(NTFY_PW) \
		--title "The server is undergoing maintenance." \
		--priority high \
		--tags maintenance,warning \
		--message "The server is undergoing maintenance, will be back to full quality in a few minutes... (I hope)" \
		https://ntfy.labuschagne.xyz/maintenance
