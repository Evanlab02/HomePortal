"""Services for the webhook logs."""

from typing import Any

from shared.repos import WHLogsRepository
from shared.services.interfaces import Service


class WHLogsService(Service):
    """Services for the webhook logs."""

    _repo: WHLogsRepository

    def __init__(self) -> None:
        """Initialize the service."""
        self._repo = WHLogsRepository()

    def create(self, data: dict[str, Any]) -> None:
        """Create a new record in the database."""
        self._repo.create(data)
