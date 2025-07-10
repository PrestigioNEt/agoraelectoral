from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.schemas.user import UserProfile
from app.models.user import Profile
from app.core.config import engine
from app.core.security import get_current_user_id

router = APIRouter()

@router.get("/me", response_model=UserProfile)
async def read_users_me(current_user_id: str = Depends(get_current_user_id)):
    with Session(engine) as session:
        profile = session.get(Profile, current_user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        return profile
