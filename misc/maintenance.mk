.PHONY: back-to-normal
back-to-normal:
	@echo "Sending back to normal notification..."
	@docker compose exec ntfy ntfy pub \
		-u $(NTFY_USER):$(NTFY_PW) \
		--title "Server is back to normal and there is no more planned maintenance" \
		--priority default \
		--tags computer,dizzy_face,success\
		https://ntfy.labuschagne.xyz/hp-all
	@echo "Sent back to normal notification"
	@echo "Done"

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
	@sudo shutdown -r +1
	@echo "Reboot scheduled"
	@echo "Done"

.PHONY: shutdown
shutdown:
	@echo "Sending shutdown notification..."
	@docker compose exec ntfy ntfy pub \
		-u $(NTFY_USER):$(NTFY_PW) \
		--title "🛑 The Great Server Hibernation" \
		--priority urgent \
		--tags sleeping,power,warning\
		--click https://www.youtube.com/watch?v=Gb2jGy76v0Y \
		--message "The server is rage quitting! 😤 Time for its beauty sleep. Please don't panic - it's just having an existential crisis and needs some alone time 🧘‍♂️" \
		https://ntfy.labuschagne.xyz/hp-all
	@echo "Sent shutdown notification"
	@echo "Scheduling shutdown"
	@sudo shutdown +1
	@echo "Shutdown scheduled"
	@echo "Done"

.PHONY: testing
testing:
	@echo "Sending testing notification..."
	@docker compose exec ntfy ntfy pub \
		-u $(NTFY_USER):$(NTFY_PW) \
		--title "Mad Science in Progress!" \
		--priority default \
		--tags test_tube,microscope,warning\
		--click https://giphy.com/gifs/mrw-post-vote-YYfEjWVqZ6NDG \
		--message "Alert! I am poking the server with a stick again 🥸 Things might get weird... or explode... or both! Consider this your warning and maybe go touch some grass 🌱" \
		https://ntfy.labuschagne.xyz/hp-all
	@echo "Sent testing notification"
	@echo "Done"

.PHONY: update
update:
	@echo "Sending update notification..."
	@docker compose exec ntfy ntfy pub \
		-u $(NTFY_USER):$(NTFY_PW) \
		--title "Package Therapy Session Starting!" \
		--priority default \
		--tags package,arrows_counterclockwise,sparkles\
		--click https://xkcd.com/1197/ \
		--message "Time for the server's monthly vitamin supplements! 💊 All those outdated packages are about to get a reality check. Don't worry, I promise this won't hurt... much" \
		https://ntfy.labuschagne.xyz/hp-all
	@echo "Sent update notification"
	@echo "Updating..."
	@sudo nala update
	@echo "Update completed"
	@echo "Done"

.PHONY: upgrade
upgrade:
	@echo "Sending upgrade notification..."
	@docker compose exec ntfy ntfy pub \
		-u $(NTFY_USER):$(NTFY_PW) \
		--title "Server Glow-Up Transformation!" \
		--priority urgent \
		--tags rocket,sparkles,hammer_and_wrench\
		--click https://giphy.com/gifs/loading-computer-cat-JIX9t2j0ZTN9S \
		--message "Breaking news: The server is getting a makeover! 💅 Time to upgrade from peasant packages to fancy new ones. This might take a while, so grab some coffee ☕" \
		https://ntfy.labuschagne.xyz/hp-all
	@echo "Sent upgrade notification"
	@echo "Upgrading..."
	@sudo nala upgrade
	@echo "Upgrade completed"
	@echo "Sending upgrade completion notification"
	@docker compose exec ntfy ntfy pub \
		-u $(NTFY_USER):$(NTFY_PW) \
		--title "Mission Accomplished (Probably)!" \
		--priority urgent \
		--tags partying_face,tada,checkered_flag\
		--click https://www.youtube.com/watch?v=LDU_Txk06tM \
		--message "Ta-da! 🎭 The server has successfully survived another upgrade! It's now 0.001% more awesome and 99% more likely to work... hopefully" \
		https://ntfy.labuschagne.xyz/hp-all
	@echo "Sent upgrade completion notification"
	@echo "Done"
