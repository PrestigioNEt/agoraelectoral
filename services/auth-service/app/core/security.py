from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session

from app.core.config import SUPABASE_JWT_SECRET, SUPABASE_ALGORITHM, engine
from app.schemas.user import TokenData
from app.models.user import Profile

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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

async def get_current_user_profile(current_user_id: str = Depends(get_current_user_id)):
    with Session(engine) as session:
        profile = session.get(Profile, current_user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        return profile
