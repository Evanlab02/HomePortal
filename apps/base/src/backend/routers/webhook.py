"""Contains the webhook router."""

import logging
from typing import Any

from fastapi import APIRouter

from shared.services import WHLogsService

SERVICE = WHLogsService()

router = APIRouter(prefix="/api/v1/webhook", tags=["webhook"])
logger = logging.getLogger(__name__)


@router.post("/log")
async def webhook(payload: dict[str, Any]) -> dict[str, str]:
    """Webhook endpoint."""
    logger.info("Webhook received: %s", payload)
    await SERVICE.create(payload)
    return {"status": "ok"}
