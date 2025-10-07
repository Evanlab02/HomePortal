.PHONY: py-compile
py-compile:
	@uv pip compile dependencies/requirements.in -o requirements.txt
	@uv pip compile dependencies/requirements.dev.in -o requirements.dev.txt

.PHONY: py-install
py-install:
	@uv pip install -r requirements.dev.txt

.PHONY: py-venv-setup
py-venv-setup:
	@uv venv
