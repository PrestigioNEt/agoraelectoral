from fastapi import FastAPI, HTTPException
import redis

app = FastAPI()

# Configuración de Redis
redis_client = redis.Redis(host='redis', port=6379, db=0)

@app.get("/")
def read_root():
    return {"message": "CRM Service is running"}

@app.get("/redis-test")
async def redis_test():
    try:
        redis_client.incr("crm_service_counter")
        current_value = redis_client.get("crm_service_counter").decode('utf-8')
        return {"message": f"CRM Service Redis counter: {current_value}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Redis error: {e}")
