"""Contains utilities tasks that do not fall into a specific category."""

from logging import getLogger

from celery import shared_task

from shared.clients.qbit_client import QBitClient
from tasks.utils.helpers import read_forwarded_port

logger = getLogger(__name__)

@shared_task
def sync_gluetun_port() -> None:
    """Sync the Gluetun port."""
    try:
        exposed_gluetun_port: int = read_forwarded_port()
        client = QBitClient()
        client.login()
        client.set_qbit_port(exposed_gluetun_port)
        client.clean()
    except Exception as e:
        logger.error(f"Error: {e}")
