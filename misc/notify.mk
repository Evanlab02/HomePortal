.PHONY: ntfy
ntfy:
	docker compose exec ntfy ntfy ${ARGS}

.PHONY: notify
notify:
	docker compose exec ntfy ntfy pub -p ${PRIORITY} -u $(NTFY_USER):$(NTFY_PW) --tags warning https://ntfy.labuschagne.xyz/hp-all ${MESSAGE}
