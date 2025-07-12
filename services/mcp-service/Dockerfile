# Use an official Python runtime as a parent image
FROM python:3.11-slim

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

# Crear un usuario y grupo no root
RUN groupadd -r appgroup && useradd -r -g appgroup -d /app -s /sbin/nologin appuser

# Cambiar la propiedad de los archivos de la aplicación al usuario no root
RUN chown -R appuser:appgroup /app

# Cambiar al usuario no root
USER appuser

# Run the application
CMD ["poetry", "run", "python", "app/main.py"]