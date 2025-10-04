FROM python:3.13.7-alpine3.22

WORKDIR /app

COPY requirements.backend.txt .
RUN pip install -r requirements.backend.txt
COPY src/ /app/
RUN rm -rf /app/.env.template
RUN rm -rf /app/.env

CMD ["python", "main.py", "server"]
