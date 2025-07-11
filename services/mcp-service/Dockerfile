# Use an official Python runtime as a parent image
FROM python:3.11-slim-buster

# Set the working directory in the container
WORKDIR /app

# Install Poetry
RUN pip install poetry

# Copy pyproject.toml and poetry.lock (if you have one)
COPY pyproject.toml ./

ENV POETRY_VIRTUALENVS_IN_PROJECT=true

# Install dependencies
RUN poetry install --no-root

# Copy the application code
ENV PATH="/app/.venv/bin:$PATH"

# Copy the application code
COPY app/ ./app

# Run the application
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]