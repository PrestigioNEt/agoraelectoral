from fastapi import FastAPI, HTTPException
import redis
from pydantic import BaseModel # Import BaseModel
from typing import Any # For generic payload content initially

app = FastAPI()

# Define Pydantic model for the notification payload
class NotificationPayload(BaseModel):
    recipient: str
    content: Any # Could be a more specific model later
    source: str | None = None

# Configuración de Redis
redis_client = redis.Redis(host='redis', port=6379, db=0)

@app.get("/")
async def read_root():
    return {"message": "Notifications Service (Python) is running!"}

@app.post("/send")
async def send_notification(payload: NotificationPayload): # Changed from message: dict
    # Aquí iría la lógica para enviar notificaciones
    # You can now access payload.recipient, payload.content, etc.
    print(f"Sending notification to {payload.recipient}: {payload.content} (from {payload.source or 'unknown'})")
    return {"status": "Notification sent", "details": payload.model_dump()} # Return the validated data

@app.get("/redis-test")
async def redis_test():
    try:
        redis_client.incr("notifications_service_counter")
        current_value = redis_client.get("notifications_service_counter").decode('utf-8')
        return {"message": f"Notifications Service Redis counter: {current_value}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Redis error: {e}")
