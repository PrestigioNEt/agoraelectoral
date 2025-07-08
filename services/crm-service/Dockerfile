# Etapa de dependencias
FROM python:3.11-slim as deps

WORKDIR /usr/src/app

RUN pip install poetry

COPY pyproject.toml poetry.lock* ./

RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

# Etapa de producción
FROM python:3.11-slim as production

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY ./app /usr/src/app/app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]