"""Contains the main module for the task worker."""

import json
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
        login_status = login.status_code
        if login_status != 200:
            logger.error(f"Login Status: {login_status}")
            raise Exception(f"Login Status: {login_status}")
        else:
            logger.info(f"Login Status: {login_status}")

        current_config = session.get(
            "http://hp-gluetun:8080/api/v2/app/preferences",
        )
        current_config_status = current_config.status_code
        if current_config_status != 200:
            logger.error(f"Current Config Status: {current_config_status}")
            raise Exception(f"Current Config Status: {current_config_status}")
        else:
            logger.info(f"Current Config Status: {current_config_status}")
            logger.info(f"Current Port: {current_config.json()['listen_port']}")

        if port == int(current_config.json()["listen_port"]):
            logger.info(f"Port is already set to {port}")
            return

        response = session.post(
            "http://hp-gluetun:8080/api/v2/app/setPreferences",
            data={"json": json.dumps({"listen_port": port})},
        )
        logger.info(f"Response Status: {response.status_code}")

        session.close()
    except Exception as e:
        logger.error(f"Error: {e}")
    finally:
        logger.info("Closing session")
        session.close()
        logger.info(f"Port synced: {port}")


@app.on_after_configure.connect  # type: ignore
def setup_periodic_tasks(sender: Celery, **_: Any) -> None:
    """Periodic tasks setup."""
    sender.add_periodic_task(600.0, sync_gluetun_port.s())
