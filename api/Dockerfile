FROM python:3.8-buster

# Set working directory
WORKDIR /app

# Install gcc and other compile dependencies
RUN apt-get update && \
    apt-get install -y \
    gcc \
    libffi-dev \
    default-jdk \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

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

ENV OPENAI_API_KEY=""

# Set Python to run in unbuffered mode
ENV PYTHONUNBUFFERED=1

# Expose the port the app runs on
EXPOSE 8080

# Switch to non-root user
USER appuser

# Command to run the application with error logging
CMD ["python", "-u", "app.py"]