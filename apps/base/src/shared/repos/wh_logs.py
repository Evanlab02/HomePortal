"""Repository for the webhook logs."""

from typing import Any

from shared.config import MONGO_URI
from shared.db import MongoDBClient
from shared.repos.interfaces import Repository


class WHLogsRepository(Repository):
    """Repository for the webhook logs."""

    def __init__(self) -> None:
        """
        Initialize the repository.

        Args:
            client: The database client.
        """
        self._client = MongoDBClient(
            connection_uri=MONGO_URI,
            db="homeportal",
            collection="wh_logs",
        )

    def create(self, data: dict[str, Any]) -> None:
        """Create a new record in the database."""
        self._client.create(data)
