"""Entry point for the application."""

import logging
from sys import argv
from typing import Callable

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(levelname)s][%(asctime)s] %(name)s: %(message)s",
)

CLI_ARGUMENTS = argv[1:]
start_func: Callable[[list[str]], None] | None = None

if CLI_ARGUMENTS[0] == "server":
    from backend import start

    start_func = start
else:
    from cli import start_cli

    start_func = start_cli

if __name__ == "__main__":
    start_func(CLI_ARGUMENTS)
