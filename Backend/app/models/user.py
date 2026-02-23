from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr

class User(BaseModel):
    id_user: Optional[str] = None
    email: EmailStr
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.now)
    account_status: str = "active"  
    is_verified: bool = False
