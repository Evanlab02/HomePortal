"""Main module for the backend."""

import logging

from uvicorn import run

logger = logging.getLogger(__name__)


def start(args: list[str]) -> None:
    """Start the server."""
    reload = False
    if "--debug" in args or "--dev" in args or "--reload" in args:
        reload = True

    logger.info("Starting the server...")
    logger.info("Reload: %s", reload)
    run(
        "backend.app:api",
        host="0.0.0.0",
        port=8000,
        reload=reload,
        log_config=None,
    )
