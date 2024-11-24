FROM python:3.8-alpine

# Set working directory
WORKDIR /app

# Installs gcc and other compile dependencies
# RUN apt-get update && \
#     apt-get install -y \
#     gcc \
#     default-jdk \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*
RUN apk add --no-cache gcc musl-dev libffi-dev openjdk8


# Copy only requirements first to leverage Docker cache
COPY requirements.txt requirements.txt

# Install dependencies
RUN pip install -r requirements.txt

# Create a non-root user and switch to it
RUN adduser --disabled-password --gecos '' appuser

# Copy the rest of the application
COPY . .

# Set proper permissions for the application directory
RUN chown -R appuser:appuser /app

# The API key should be passed at runtime, not build time
ENV OPENAI_API_KEY="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"

# Set Python to run in unbuffered mode
ENV PYTHONUNBUFFERED=1

# Expose the port the app runs on
EXPOSE 8080

# Switch to non-root user
USER appuser

# Command to run the application with error logging
CMD ["python", "-u", "app.py"]