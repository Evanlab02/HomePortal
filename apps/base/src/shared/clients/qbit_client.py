"""Contains the QBitTorrent client."""

import json
from logging import getLogger

from requests import Response, Session

from shared.config import QBITTORRENT_PASSWORD, QBITTORRENT_USERNAME, QBITTORRENT_HOST

class QBitClient:
    """The QBitTorrent client."""

    def __init__(self):
        """Initialize the client."""
        self.log = getLogger(__name__)
        self.session = Session()
        self.host = QBITTORRENT_HOST
        self.username = QBITTORRENT_USERNAME
        self.password = QBITTORRENT_PASSWORD

    def __handle_response(self, response: Response) -> bool:
        """
        Handle the response object result and logging.

        Args:
            response(Response): The response object from the session.

        Returns:
            bool: If the request was successful.
        """
        status = response.status_code
        url = response.url
        message = f"QBITTORRENT CLIENT | {url} | {status}"

        if status != 200:
            self.log.error(message)
            return False

        self.log.info(message)
        return True

    def login(self) -> bool:
        """
        Login into the QBitTorrent API.

        Returns:
            bool: The result of the call.
        """
        response = self.session.post(
            f"{self.host}/api/v2/auth/login",
            data={"username": QBITTORRENT_USERNAME, "password": QBITTORRENT_PASSWORD},
        )
        return self.__handle_response(response=response)

    def set_qbit_port(self, gluetun_port: int) -> bool:
        """
        Sets the QBitTorrent listening port.

        Returns:
            bool: The result of the call.
        """
        qbit_port = 0
        response = self.session.get(f"{self.host}/api/v2/app/preferences")
        result = self.__handle_response(response=response)
        if result:
            qbit_port = int(response.json()["listen_port"])
            self.log.info(f"QBITTORRENT CLIENT | CURRENT LISTENING PORT | {qbit_port}")
            return False

        if qbit_port == gluetun_port:
            self.log.info("QBITTORRENT CLIENT | PORTS ARE ALREADY SYNCED | SKIPPING")
            return False

        response = self.session.post(
            f"{self.host}/api/v2/app/setPreferences",
            data={"json": json.dumps({"listen_port": gluetun_port})},
        )
        return self.__handle_response(response=response)

    def clean(self) -> None:
        """Clean and close the client."""
        self.session.close()
