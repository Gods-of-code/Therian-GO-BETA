from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field

class profile(BaseModel):
    id_profile: Optional[str] = None
    id_user: str
    display_name: str
    birth_date: date
    gender: str
    bio: Optional[str] = None
    height_cm: Optional[float] = None
    updated_at: datetime = Field(default_factory=datetime.now)