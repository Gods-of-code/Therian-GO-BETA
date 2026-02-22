from typing import Optional
from pydantic import BaseModel

class Location(BaseModel):
    id_location: Optional[str] = None
    country: str
    city: str
