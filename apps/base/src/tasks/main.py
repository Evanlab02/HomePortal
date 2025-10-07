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
    session = requests.Session()
    port: str | int | None = None

    try:
        with open("./config/forwarded_port", "r") as f:
            port = f.read().strip()
            port = int(port)

        logger.info(f"Gluetun port: {port}")

        login = session.post(
            "http://hp-gluetun:8080/api/v2/auth/login",
            data={"username": QBITTORRENT_USERNAME, "password": QBITTORRENT_PASSWORD},
        )
        logger.info(f"Login Status: {login.status_code}")

        current_config = session.get(
            "http://hp-gluetun:8080/api/v2/app/preferences",
        )
        logger.info(f"Current Config Status: {current_config.status_code}")
        logger.info(f"Current Port: {current_config.json()['listen_port']}")

        response = session.post(
            "http://hp-gluetun:8080/api/v2/app/setPreferences",
            headers={"content-type": "application/json"},
            json={"listen_port": port},
        )
        logger.info(f"Response Status: {response.status_code}")

        session.close()
    except Exception as e:
        logger.error(f"Error: {e}")
    finally:
        logger.info("Closing session")
        session.close()
        logger.info(f"Finishing with port: {port}")


@app.on_after_configure.connect  # type: ignore
def setup_periodic_tasks(sender: Celery, **_: Any) -> None:
    """Periodic tasks setup."""
    sender.add_periodic_task(10.0, sync_gluetun_port.s())
