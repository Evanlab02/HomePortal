.PHONY: py-format
py-format:
	@black src/
	@isort src/ --profile black

.PHONY: py-lint
py-lint:
	@black --check src/
	@isort src/ --check-only --profile black
	@flake8 src/ --max-line-length=100
	@mypy src/ --strict
