import redis # Import redis for the exception type
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import create_db_and_tables_async, redis_client # Changed to async version
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
async def on_startup(): # Made the function async
    await create_db_and_tables_async() # Call the async version and await
    # Add Redis connection check
    try:
        # redis-py's ping is synchronous. For a fully async app, you might use aioredis.
        # For now, this sync ping in an async startup is acceptable if it's quick.
        redis_client.ping()
        print("Successfully connected to Redis!")
    except redis.exceptions.ConnectionError as e: # Ensure redis is imported if not already
        raise RuntimeError(f"Could not connect to Redis: {e}")
