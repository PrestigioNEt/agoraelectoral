# Use an official Python runtime as a parent image
FROM python:3.11-slim-buster

# Set the working directory in the container
WORKDIR /app

# Install Poetry
RUN pip install poetry

# Copy pyproject.toml and poetry.lock (if you have one)
COPY pyproject.toml ./

# Install dependencies
RUN poetry install --no-root

# Copy the application code
COPY app/ ./app

# Run the application
CMD ["poetry", "run", "python", "app/main.py"]