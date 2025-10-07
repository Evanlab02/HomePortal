FROM python:3.13.7-alpine3.22

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt
COPY src/ /app/
RUN rm -rf /app/.env.template
RUN rm -rf /app/.env

CMD ["celery", "-A", "tasks.main", "worker", "-B", "--loglevel=info"]
