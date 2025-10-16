"""Shared Celery app configuration."""

from celery import Celery

app = Celery("tasks.main", broker="redis://hp-valkey8:6379/", backend="redis://hp-valkey8:6379/")
app.conf.timezone = "UTC"

app.autodiscover_tasks([
    "shared.tasks.qbit",
    "shared.tasks.wh_logs",
])
