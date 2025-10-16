"""Interfaces for the database repositories."""

from abc import ABC, abstractmethod
from typing import Any

from shared.db.interfaces import DatabaseClient


class Repository(ABC):
    """Interfaces for the database repositories."""

    _client: DatabaseClient

    @abstractmethod
    def clean(self) -> None:
        """Clean the client."""

    @abstractmethod
    def create(self, data: dict[str, Any]) -> None:
        """Create a new record in the database."""
