# Etapa de dependencias
FROM python:3.11-slim as deps

WORKDIR /app

RUN pip install poetry

COPY pyproject.toml poetry.lock* ./

# Forzar a Poetry a crear el entorno virtual dentro del proyecto
ENV POETRY_VIRTUALENVS_IN_PROJECT=true

# Instalar dependencias directamente en el entorno virtual de Poetry
RUN poetry install --no-root

# Etapa de producción
FROM python:3.11-slim as production

# Crear un usuario y grupo no root
RUN groupadd -r appgroup && useradd -r -g appgroup -d /app -s /sbin/nologin appuser # Changed home dir

WORKDIR /app # Changed WORKDIR

# Copiar el entorno virtual de Poetry desde la etapa de dependencias
# Asegurarse de que el directorio .venv exista antes de copiar para evitar errores si no se crea.
RUN mkdir -p .venv && chown appuser:appgroup .venv
COPY --from=deps --chown=appuser:appgroup /app/.venv ./.venv

# Asegurarse de que el PATH incluya el binario del venv
ENV PATH="/app/.venv/bin:$PATH"

COPY --chown=appuser:appgroup app/ ./app # Changed destination to ./app

# Cambiar la propiedad de los archivos de la aplicación al usuario no root
RUN chown -R appuser:appgroup /app # Changed path

# Cambiar al usuario no root
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
