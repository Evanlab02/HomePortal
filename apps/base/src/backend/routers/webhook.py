"""Contains the webhook router."""

import logging
from typing import Any

from fastapi import APIRouter

from shared.services import WHLogsService
from shared.tasks.wh_logs import task_webhook_log

SERVICE = WHLogsService()

router = APIRouter(prefix="/api/v1/webhook", tags=["webhook"])
logger = logging.getLogger(__name__)


@router.post("/log")
async def webhook(payload: dict[str, Any]) -> dict[str, str]:
    """Webhook endpoint."""
    task_webhook_log.delay(payload)  # type: ignore
    return {"status": "ok"}
