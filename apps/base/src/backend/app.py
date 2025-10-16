"""Sets up the FastAPI app."""

import logging
from sys import argv

from fastapi import FastAPI

from backend.routers import health_router, webhook_router
from shared.celery import app as _

ARGUMENTS = argv[1:]

logger = logging.getLogger(__name__)

api = FastAPI(
    title="Home Portal API",
    version="pre-alpha",
)
api.include_router(health_router)
api.include_router(webhook_router)

debug = False
if "--debug" in ARGUMENTS or "--dev" in ARGUMENTS:
    debug = True
api.debug = debug
logger.info("Debug: %s", debug)
