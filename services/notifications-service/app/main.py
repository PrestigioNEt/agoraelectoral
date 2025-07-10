from fastapi import FastAPI, HTTPException
import redis

app = FastAPI()

# Configuración de Redis
redis_client = redis.Redis(host='redis', port=6379, db=0)

@app.get("/")
async def read_root():
    return {"message": "Notifications Service (Python) is running!"}

@app.post("/send")
async def send_notification(message: dict):
    # Aquí iría la lógica para enviar notificaciones
    print(f"Sending notification: {message}")
    return {"status": "Notification sent", "message": message}

@app.get("/redis-test")
async def redis_test():
    try:
        redis_client.incr("notifications_service_counter")
        current_value = redis_client.get("notifications_service_counter").decode('utf-8')
        return {"message": f"Notifications Service Redis counter: {current_value}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Redis error: {e}")
