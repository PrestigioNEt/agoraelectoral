from fastapi import FastAPI, HTTPException
import redis

app = FastAPI()

# Configuración de Redis
redis_client = redis.Redis(host='redis', port=6379, db=0)

@app.get("/")
async def read_root():
    return {"message": "Analytics Service (Python) is running!"}

@app.get("/analyze")
async def analyze_data():
    return {"analysis": "Data analysis results (example)."}

@app.get("/redis-test")
async def redis_test():
    try:
        redis_client.incr("analytics_service_counter")
        current_value = redis_client.get("analytics_service_counter").decode('utf-8')
        return {"message": f"Analytics Service Redis counter: {current_value}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Redis error: {e}")
