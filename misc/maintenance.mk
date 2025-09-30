.PHONY: reboot
reboot:
	@echo "Sending reboot notification..."
	@docker compose exec ntfy ntfy pub \
		-u $(NTFY_USER):$(NTFY_PW) \
		--title "🔄 Surprise! Time for another reboot!" \
		--priority urgent \
		--tags computer,dizzy_face,warning\
		--click https://giphy.com/gifs/have-you-tried-turning-it-off-and-on-again-F7yLXA5fJ5sLC \
		--message "The server has decided it needs a little nap 💤 Don't worry, it'll be back faster than you can say 'have you tried turning it off and on again?'" \
		https://ntfy.labuschagne.xyz/hp-all
	@echo "Sent reboot notification"
	@echo "Scheduling reboot"
	@sudo shutdown -r+1
	@echo "Reboot scheduled"
	@echo "Done"

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