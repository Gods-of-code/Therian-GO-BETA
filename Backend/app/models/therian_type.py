from typing import Optional
from pydantic import BaseModel

class Therian_type(BaseModel):
    id_therian_type: Optional[str] = None
    code_name: str
    display_name_es: str
    description_es: str