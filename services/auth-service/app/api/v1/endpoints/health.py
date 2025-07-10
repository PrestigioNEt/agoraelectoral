from fastapi import APIRouter, HTTPException

from app.core.config import redis_client

router = APIRouter()

@router.get("/")
def read_root():
    return {"message": "Auth Service is running"}

@router.get("/redis-test")
async def redis_test():
    try:
        redis_client.incr("auth_service_counter")
        current_value = redis_client.get("auth_service_counter").decode('utf-8')
        return {"message": f"Auth Service Redis counter: {current_value}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Redis error: {e}")
