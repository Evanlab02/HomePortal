"""Contains the webhook logs tasks."""

from typing import Any

from celery import shared_task

from shared.services import WHLogsService


@shared_task
def task_webhook_log(payload: dict[str, Any]) -> None:
    """
    Save the webhook payload to the logs collection in mongo.

    Args:
        payload(dict[str, Any]): The webhook payload.
    """
    service = WHLogsService()
    service.create(payload)
    service.clean()
