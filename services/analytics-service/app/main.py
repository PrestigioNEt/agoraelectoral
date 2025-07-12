from fastapi import FastAPI, HTTPException
import aioredis # Import aioredis
from contextlib import asynccontextmanager

# Global variable for Redis client, initialized on startup
redis_client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Redis client
    global redis_client
    try:
        redis_client = await aioredis.from_url("redis://redis:6379/0")
        await redis_client.ping() # Verify connection
        print("Successfully connected to Redis using aioredis!")
    except Exception as e:
        # If Redis connection fails on startup, we might want to raise an error
        # or log it and continue, depending on how critical Redis is.
        # For this example, let's print and allow startup, but endpoints might fail.
        print(f"Could not connect to Redis on startup: {e}")
        redis_client = None # Ensure client is None if connection failed

    yield

    # Shutdown: Close Redis client
    if redis_client:
        await redis_client.close()
        print("Redis connection closed.")

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def read_root():
    return {"message": "Analytics Service (Python) is running!"}

@app.get("/analyze")
async def analyze_data():
    return {"analysis": "Data analysis results (example)."}

@app.get("/redis-test")
async def redis_test():
    if not redis_client:
        raise HTTPException(status_code=503, detail="Redis is not available")
    try:
        # Ensure counter key exists before incrementing if needed, or handle None from get
        await redis_client.incr("analytics_service_counter")
        current_value_bytes = await redis_client.get("analytics_service_counter")
        if current_value_bytes is None:
            # This case should ideally not happen if incr worked, but good to be safe
            current_value = "0"
        else:
            current_value = current_value_bytes.decode('utf-8')
        return {"message": f"Analytics Service Redis counter: {current_value}"}
    except aioredis.RedisError as e: # More specific exception for aioredis
        raise HTTPException(status_code=500, detail=f"Redis error: {str(e)}")
    except Exception as e: # Catch other potential errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
