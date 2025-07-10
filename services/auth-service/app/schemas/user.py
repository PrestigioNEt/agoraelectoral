from pydantic import BaseModel
from typing import Optional

class TokenData(BaseModel):
    id: Optional[str] = None

class UserProfile(BaseModel):
    id: str
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str
