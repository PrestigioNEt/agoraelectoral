# Etapa de dependencias
FROM python:3.11-slim as deps

WORKDIR /usr/src/app

RUN pip install poetry

COPY pyproject.toml poetry.lock* ./

# Forzar a Poetry a crear el entorno virtual dentro del proyecto
ENV POETRY_VIRTUALENVS_IN_PROJECT=true

# Instalar dependencias directamente en el entorno virtual de Poetry
RUN poetry install --no-root

# Etapa de producción
FROM python:3.11-slim as production

WORKDIR /usr/src/app

# Copiar el entorno virtual de Poetry desde la etapa de dependencias
COPY --from=deps /usr/src/app/.venv /usr/src/app/.venv

# Asegurarse de que el PATH incluya el binario de Poetry
ENV PATH="/usr/src/app/.venv/bin:$PATH"

COPY ./app /usr/src/app/app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
