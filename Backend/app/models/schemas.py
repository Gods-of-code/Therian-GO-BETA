from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# ── Auth / Users ──────────────────────────────────────────────

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserDB(BaseModel):
    id_user: Optional[str] = None
    username: Optional[str] = None
    email: EmailStr
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    account_status: str = "active"
    is_verified: bool = False
    disabled: bool = False


class UserPublic(BaseModel):
    id_user: Optional[str] = None
    username: Optional[str] = None
    email: EmailStr
    account_status: str = "active"
    is_verified: bool = False
    disabled: bool = False


# ── GeoJSON helper ────────────────────────────────────────────

class GeoJSONPoint(BaseModel):
    type: str = "Point"
    coordinates: List[float] = Field(
        ...,
        min_length=2,
        max_length=2,
        description="[longitude, latitude]",
    )


# ── Profiles ──────────────────────────────────────────────────

class ProfileCreate(BaseModel):
    display_name: str
    birth_date: date
    gender: str
    bio: Optional[str] = None
    height_cm: Optional[float] = None
    therian_identities: List[dict] = []
    goal_ids: List[str] = []
    location: Optional[GeoJSONPoint] = None


class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    height_cm: Optional[float] = None
    gender: Optional[str] = None
    therian_identities: Optional[List[dict]] = None
    goal_ids: Optional[List[str]] = None
    location: Optional[GeoJSONPoint] = None


class ProfileOut(BaseModel):
    id: str
    user_id: str
    display_name: str
    birth_date: date
    gender: str
    bio: Optional[str] = None
    height_cm: Optional[float] = None
    therian_identities: List[dict] = []
    goal_ids: List[str] = []
    location: Optional[dict] = None
    created_at: datetime
    updated_at: datetime


# ── Likes ─────────────────────────────────────────────────────

class LikeCreate(BaseModel):
    to_profile: str


class LikeOut(BaseModel):
    id: str
    from_profile: str
    to_profile: str
    created_at: datetime


# ── Matches ───────────────────────────────────────────────────

class MatchOut(BaseModel):
    id: str
    match_key: str
    profiles: List[str]
    created_at: datetime


# ── Messages ──────────────────────────────────────────────────

class MessageCreate(BaseModel):
    match_id: str
    body: str


class MessageOut(BaseModel):
    id: str
    match_id: str
    sender_profile: str
    body: str
    sent_at: datetime
