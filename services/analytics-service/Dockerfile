# Etapa de dependencias
FROM python:3.11-slim as deps

WORKDIR /app

RUN pip install poetry

COPY pyproject.toml poetry.lock* ./

# Forzar a Poetry a crear el entorno virtual dentro del proyecto
ENV POETRY_VIRTUALENVS_IN_PROJECT=true

# Instalar dependencias directamente en el entorno virtual de Poetry
# Idealmente, aioredis estaría en pyproject.toml. Añadiéndolo aquí para demostración.
RUN poetry install --no-root && poetry add aioredis[hiredis]

# Etapa de producción
FROM python:3.11-slim as production

# Crear un usuario y grupo no root
RUN groupadd -r appgroup && useradd -r -g appgroup -d /app -s /sbin/nologin appuser

WORKDIR /app

# Copiar el entorno virtual de Poetry desde la etapa de dependencias
# Asegurarse de que el directorio .venv exista antes de copiar para evitar errores si no se crea.
# Esto es una precaución, poetry install --no-root debería crearlo si POETRY_VIRTUALENVS_IN_PROJECT=true
RUN mkdir -p .venv && chown appuser:appgroup .venv
COPY --from=deps --chown=appuser:appgroup /app/.venv ./.venv

# Asegurarse de que el PATH incluya el binario del venv
ENV PATH="/app/.venv/bin:$PATH"

COPY --chown=appuser:appgroup app/ ./app

# Cambiar al usuario no root
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
