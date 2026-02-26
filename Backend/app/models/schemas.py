from datetime import datetime, date
from typing import Optional, List
<<<<<<< HEAD
from pydantic import BaseModel, EmailStr, Field, validator

=======
from pydantic import BaseModel, EmailStr, Field
from pydantic import validator
>>>>>>> 45ebff7 (fix schemas local changes)

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


# ────Refresh Tokens─────────────────────────────────────────── 

class RefreshToken(BaseModel):     #Modelo para refresh tokens en DB
    id: Optional[str] = None
    user_id: str
    token: str
    expires_at: datetime
    revoked: bool = False
    created_at: datetime = Field(default_factory=datetime.now)
    device_info: Optional[str] = None  # IP, user-agent, etc.

class TokenResponse(BaseModel):
    """Respuesta de login con refresh token"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  #segundos

class RefreshRequest(BaseModel):  #Solicitud de refresh
    refresh_token: str

# MODELOS PARA RECUPERACIÓN DE CONTRASEÑA
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    
    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('La contraseña debe tener al menos 8 caracteres')
        if not any(c.isupper() for c in v):
            raise ValueError('Debe contener al menos una mayúscula')
        if not any(c.islower() for c in v):
            raise ValueError('Debe contener al menos una minúscula')
        if not any(c.isdigit() for c in v):
            raise ValueError('Debe contener al menos un número')
        return v

    
class PasswordResetToken(BaseModel):           #Modelo para tokens de reset en DB
    id: Optional[str] = None
    email: str
    token: str
    expires_at: datetime
    used: bool = False
    created_at: datetime = Field(default_factory=datetime.now)



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
