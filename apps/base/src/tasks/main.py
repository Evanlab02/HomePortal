"""Contains the main module for the task worker."""

import logging
from typing import Any

from celery import Celery

from tasks.utils import sync_gluetun_port

logger = logging.getLogger(__name__)

app = Celery("tasks.main", broker="redis://hp-valkey8:6379/", backend="redis://hp-valkey8:6379/")
app.conf.timezone = "UTC"

app.autodiscover_tasks(["tasks.utils"])

@app.on_after_configure.connect  # type: ignore
def setup_periodic_tasks(sender: Celery, **_: Any) -> None:
    """Periodic tasks setup."""
    sender.add_periodic_task(10.0, sync_gluetun_port.s())
