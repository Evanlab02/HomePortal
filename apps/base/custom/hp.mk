.PHONY: hp
hp:
	@PYTHONPATH=source python src/main.py ${ARGS}

.PHONY: hp-cli
hp-cli:
	@PYTHONPATH=source python src/main.py ${ARGS}

.PHONY: hp-server
hp-server:
	@PYTHONPATH=source python src/main.py server ${ARGS}

.PHONY: hp-server-dev
hp-server-dev:
	@PYTHONPATH=source python src/main.py server --dev ${ARGS}
