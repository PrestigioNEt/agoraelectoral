from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel.ext.asyncio.session import AsyncSession # Changed from sqlmodel import Session
# from sqlmodel import Session # Keep if other sync functions remain, for now remove

from app.core.config import SUPABASE_JWT_SECRET, SUPABASE_ALGORITHM # Removed engine import
from app.schemas.user import TokenData
from app.models.user import Profile
from app.core.db import get_async_session # Import get_async_session
from datetime import datetime, timedelta # Added for token expiry

# Placeholder for JWT creation logic
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # Ensure 'sub' is a string, as it's often expected by JWT consumers
    to_encode.update({"exp": expire, "sub": str(data.get("sub"))})
    encoded_jwt = jwt.encode(to_encode, SUPABASE_JWT_SECRET.encode('utf-8'), algorithm=SUPABASE_ALGORITHM)
    return encoded_jwt
# END Placeholder JWT creation

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token") # tokenUrl relative to router prefix

async def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SUPABASE_JWT_SECRET.encode('utf-8'), algorithms=[SUPABASE_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(id=user_id)
    except JWTError:
        raise credentials_exception
    return token_data.id

async def get_current_user_profile(
    current_user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    profile = await session.get(Profile, current_user_id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404, detail="User profile not found")
    return profile
