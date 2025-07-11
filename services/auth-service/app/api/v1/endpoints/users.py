from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel.ext.asyncio.session import AsyncSession # For async session

from app.schemas.user import UserProfile, Token # Added Token
from app.models.user import Profile
# from app.core.config import engine # Removed sync engine
from app.core.db import get_async_session # Import async session dependency
from app.core.security import get_current_user_id, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES # Added create_access_token and constant
from datetime import timedelta # For token expiry

router = APIRouter()

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # This is a placeholder for actual user authentication.
    # DO NOT USE THIS IN PRODUCTION WITHOUT REAL AUTHENTICATION.
    user_id_to_token = form_data.username

    if not user_id_to_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials provided",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id_to_token}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserProfile)
async def read_users_me(
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    profile = await session.get(Profile, current_user_id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404, detail="User profile not found")
    return profile
