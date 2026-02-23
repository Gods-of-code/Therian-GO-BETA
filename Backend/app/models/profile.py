from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field

from .therian_type import Therian_type
from .relationship_goal import Relationship_goal
from .user import User
from .location import Location


class Photo(BaseModel):
    id_photo: Optional[str] = None 
    photo_url: str
    is_main: bool = False 
    uploaded_at: datetime = Field(default_factory=datetime.now)



class ProfileTherianIdentity(BaseModel):

    id_therian_type: str
    personal_description: Optional[str] = None
    


class Profile(BaseModel):
    id_profile: Optional[str] = None
    id_user: str
    display_name: str
    birth_date: date
    gender: str
    bio: Optional[str] = None
    height_cm: Optional[float] = None
    updated_at: datetime = Field(default_factory=datetime.now)


    therian_identities: List[ProfileTherianIdentity] = []

    goal_ids: List[str] = []
    
    goals_details: List[Relationship_goal] = [] 
     
    locations: List[Location] = [] 
    
    photos: List[Photo] = []

    user_details: Optional[User] = None
    
    likes_received: int = 0
    total_matches: int = 0




   