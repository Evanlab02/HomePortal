"""Contains helpers for the tasks."""

from logging import getLogger

logger = getLogger(__name__)

def read_forwarded_port() -> int:
    """
    Read the forwarded port from the gluetun config file.
    
    Can raise an exception.

    Returns:
        int: The forwarded port from gluetun.
    """
    with open("./config/forwarded_port", "r") as f:
        port = f.read().strip()
        port = int(port)
        logger.info(f"GLUETUN | EXPOSED PORT | {port}")
        return port
