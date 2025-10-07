"""Contains the main module for the task worker."""

import logging
from typing import Any

import requests
from celery import Celery

from shared.config import QBITTORRENT_PASSWORD, QBITTORRENT_USERNAME

logger = logging.getLogger(__name__)

app = Celery("tasks.main", broker="redis://hp-valkey8:6379/", backend="redis://hp-valkey8:6379/")
app.conf.timezone = "UTC"


@app.task
def sync_gluetun_port() -> None:
    """Sync the Gluetun port."""
    port: str | int | None = None

    with open("./config/forwarded_port", "r") as f:
        port = f.read().strip()
        port = int(port)

    logger.info(f"Gluetun port: {port}")
    session = requests.Session()
    session.post(
        "http://hp-gluetun:8080/api/v2/auth/login",
        data={"username": QBITTORRENT_USERNAME, "password": QBITTORRENT_PASSWORD},
    )
    response = session.post(
        "http://hp-gluetun:8080/api/v2/app/setPreferences",
        json={"port_forwarding": port},
    )
    logger.info(f"QBittorrent response: {response.json()}")
    session.close()


@app.on_after_configure.connect  # type: ignore
def setup_periodic_tasks(sender: Celery, **_: Any) -> None:
    """Periodic tasks setup."""
    sender.add_periodic_task(300.0, sync_gluetun_port.s())
