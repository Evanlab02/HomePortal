"""The base interface for the database clients."""

from abc import ABC, abstractmethod
from typing import Any


class DatabaseClient(ABC):
    """The base interface for the database clients."""

    @abstractmethod
    async def clean(self) -> None:
        """Clean the database client."""
        pass

    @abstractmethod
    async def create(self, data: Any) -> None:
        """
        Create a new record in the database.

        Args:
            data: The data to create the record with.
        """
        pass
