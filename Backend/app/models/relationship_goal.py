from typing import Optional
from pydantic import BaseModel

class Relationship_goal(BaseModel):
    id_relationship_goal: Optional[str] = None
    code_name: str
    display_name_es: str
    description_es: str