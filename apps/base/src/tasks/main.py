"""Contains the main module for the task worker."""

import logging
from typing import Any

from celery import Celery

from shared.celery import app
from shared.tasks.qbit import sync_gluetun_port

logger = logging.getLogger(__name__)


# @app.on_after_configure.connect  # type: ignore
# def setup_periodic_tasks(sender: Celery, **_: Any) -> None:
#     """Periodic tasks setup."""
#     sender.add_periodic_task(600.0, sync_gluetun_port.s())  # type: ignore
