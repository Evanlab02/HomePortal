.PHONY: reboot
reboot:
	@echo "Sending reboot notification..."
	@docker compose exec ntfy ntfy pub \
		-u $(NTFY_USER):$(NTFY_PW) \
		-t "🔄 Surprise! Time for another reboot!" \
		-p urgent \
		--tags computer,dizzy_face,warning\
		--click https://giphy.com/gifs/have-you-tried-turning-it-off-and-on-again-F7yLXA5fJ5sLC \
		"The server has decided it needs a little nap 💤 Don't worry, it'll be back faster than you can say 'have you tried turning it off and on again?'" \
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