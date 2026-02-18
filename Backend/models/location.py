from pydantic import BaseModel

class id_location(BaseModel):
    id_location: Optional[str] = None
    country: str
    city: str
