from pydantic import BaseModel
from typing import Optional
class Location(BaseModel):
    id_location: Optional[str] = None
    country: str
    city: str
