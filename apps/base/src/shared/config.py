"""Configuration module."""

import os

from dotenv import load_dotenv

load_dotenv()

MONGO_URI: str = os.getenv("MONGO_URI", "")
QBITTORRENT_HOST: str = "http://hp-gluetun:8080"
QBITTORRENT_USERNAME: str = os.getenv("QBITTORRENT_USERNAME", "")
QBITTORRENT_PASSWORD: str = os.getenv("QBITTORRENT_PASSWORD", "")
