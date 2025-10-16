"""Interfaces for the services."""

from abc import ABC, abstractmethod
from typing import Any

from shared.repos.interfaces import Repository


class Service(ABC):
    """Interfaces for the services."""

    _repo: Repository

    @abstractmethod
    def clean(self) -> None:
        """Clean the client."""

    @abstractmethod
    def create(self, data: dict[str, Any]) -> None:
        """Create a new record in the database."""
