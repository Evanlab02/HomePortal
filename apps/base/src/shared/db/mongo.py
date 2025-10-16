"""MongoDB client."""

from typing import Any, TypeAlias

from pymongo import MongoClient

from shared.db.interfaces import DatabaseClient


class MongoDBClient(DatabaseClient):
    """MongoDB client."""

    def __init__(
        self,
        connection_uri: str,
        db: str,
        collection: str,
        schema: TypeAlias = dict[str, Any],
    ) -> None:
        """
        Initialize the MongoDB client.

        Args:
            connection_uri: The URI of the MongoDB database.
            db: The name of the database.
            collection: The name of the collection.
            schema: The schema of the data.
        """
        self._client: MongoClient[schema] = MongoClient(connection_uri)
        self._db = self._client[db]
        self._collection = self._db[collection]
        self.client = self._collection

    def clean(self) -> None:
        """Clean the MongoDB client."""
        self._client.close()

    def create(self, data: Any) -> None:
        """
        Create a new record in the database.

        Args:
            data: The data to create the record with.
        """
        self.client.insert_one(data)
