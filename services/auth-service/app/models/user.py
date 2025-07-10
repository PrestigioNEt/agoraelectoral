from typing import Optional
from sqlmodel import Field, SQLModel

class ProfileBase(SQLModel):
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str = "user"

class Profile(ProfileBase, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
