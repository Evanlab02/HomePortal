"""Contains the main module for the task worker."""

import logging
from typing import Any

from celery import Celery

from shared.tasks.qbit import sync_gluetun_port

logger = logging.getLogger(__name__)

app = Celery("tasks.main", broker="redis://hp-valkey8:6379/", backend="redis://hp-valkey8:6379/")
app.conf.timezone = "UTC"

app.autodiscover_tasks([
    "shared.tasks.qbit",
    "shared.tasks.wh_logs",
])

@app.on_after_configure.connect  # type: ignore
def setup_periodic_tasks(sender: Celery, **_: Any) -> None:
    """Periodic tasks setup."""
    sender.add_periodic_task(600.0, sync_gluetun_port.s())
