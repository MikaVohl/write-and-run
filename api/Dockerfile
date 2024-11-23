FROM python:3.8-slim-buster

WORKDIR /app

# TODO: Hide key
ENV OPENAI_API_KEY="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"

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "app.py"]