"""Contains the webhook router."""

import logging
from typing import Any

from fastapi import APIRouter

from shared.tasks.wh_logs import task_webhook_log
from shared.services import WHLogsService

SERVICE = WHLogsService()

router = APIRouter(prefix="/api/v1/webhook", tags=["webhook"])
logger = logging.getLogger(__name__)


@router.post("/log")
async def webhook(payload: dict[str, Any]) -> dict[str, str]:
    """Webhook endpoint."""
    task_webhook_log.delay(payload)
    return {"status": "ok"}
