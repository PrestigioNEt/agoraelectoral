from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import create_db_and_tables, redis_client
from app.api.v1.endpoints import users, health

app = FastAPI()

origins = [
    "http://localhost:5173",  # Allow requests from your frontend
    # You might need to add other origins for production or other environments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(health.router, tags=["health"])

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # Add Redis connection check
    try:
        redis_client.ping()
        print("Successfully connected to Redis!")
    except redis.exceptions.ConnectionError as e:
        raise RuntimeError(f"Could not connect to Redis: {e}")
