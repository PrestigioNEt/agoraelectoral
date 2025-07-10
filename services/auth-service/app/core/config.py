import os
from sqlmodel import create_engine, SQLModel
import redis

# Database Configuration
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL must be set as an environment variable")
engine = create_engine(DATABASE_URL)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Redis Configuration
redis_client = redis.Redis(host='redis', port=6379, db=0)

# JWT Configuration
SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET")
SUPABASE_ALGORITHM = "HS256"

if not SUPABASE_JWT_SECRET:
    raise ValueError("SUPABASE_JWT_SECRET must be set as an environment variable")
