import os
from sqlmodel import create_engine, SQLModel # Keep SQLModel for models
from sqlalchemy.ext.asyncio import create_async_engine # For async engine
import redis

# Database Configuration
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL must be set as an environment variable")

# Asynchronous engine
async_engine = create_async_engine(DATABASE_URL, echo=False) # Set echo=True for debugging SQL

# create_db_and_tables() sync version is removed as it's phased out.

async def create_db_and_tables_async(): # Async version for startup
    async with async_engine.begin() as conn:
        # await conn.run_sync(SQLModel.metadata.drop_all) # Optional: for resetting DB
        await conn.run_sync(SQLModel.metadata.create_all)

# Redis Configuration
redis_client = redis.Redis(host='redis', port=6379, db=0)

# JWT Configuration
SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET")
SUPABASE_ALGORITHM = "HS256"

if not SUPABASE_JWT_SECRET:
    raise ValueError("SUPABASE_JWT_SECRET must be set as an environment variable")
