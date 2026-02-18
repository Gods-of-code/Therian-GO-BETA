from pydantic import BaseModel

class identification_level(BaseModel):
    id_identification_level: Optional[str] = None
    code_name: str
    display_name_es: str
