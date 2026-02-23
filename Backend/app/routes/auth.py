from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from dotenv import load_dotenv
from pathlib import Path
import os

from app.db import get_db
from app.models.schemas import UserCreate, UserDB, UserPublic


env_path = Path(__file__).resolve().parent.parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_DURATION = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY no está configurada en el archivo .env")

router = APIRouter(prefix="/auth", tags=["Auth"])

oauth2 = OAuth2PasswordBearer(tokenUrl="/auth/login")
crypt = CryptContext(schemes=["bcrypt"])


# ── Helpers ───────────────────────────────────────────────────

async def _find_user_doc(identifier: str):
    db = get_db()
    return await db["users"].find_one(
        {"$or": [{"username": identifier}, {"email": identifier}]}
    )


def _doc_to_user_db(doc: dict) -> UserDB:
    doc["id_user"] = str(doc.pop("_id", None))
    return UserDB(**doc)


def _doc_to_user_public(doc: dict) -> UserPublic:
    doc["id_user"] = str(doc.pop("_id", None))
    return UserPublic(**doc)


async def auth_user(token: str = Depends(oauth2)) -> UserPublic:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales de autenticación inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    doc = await _find_user_doc(username)
    if not doc:
        raise credentials_exception

    return _doc_to_user_public(doc)


async def current_user(user: UserPublic = Depends(auth_user)) -> UserPublic:
    if user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario inactivo",
        )
    return user


# ── Endpoints ─────────────────────────────────────────────────

@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate):
    db = get_db()

    # Verificar duplicados
    existing = await db["users"].find_one(
        {"$or": [{"email": user_in.email}, {"username": user_in.username}]}
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario con ese email o username",
        )

    user_doc = {
        "username": user_in.username,
        "email": user_in.email,
        "password_hash": crypt.hash(user_in.password),
        "created_at": datetime.utcnow(),
        "account_status": "active",
        "is_verified": False,
        "disabled": False,
    }

    result = await db["users"].insert_one(user_doc)
    user_doc["id_user"] = str(result.inserted_id)

    return UserPublic(**user_doc)


@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    doc = await _find_user_doc(form.username)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario o contraseña incorrectos",
        )

    if not crypt.verify(form.password, doc["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario o contraseña incorrectos",
        )

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_DURATION)
    access_token = jwt.encode(
        {"sub": doc["username"], "exp": expire},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserPublic)
async def read_current_user(user: UserPublic = Depends(current_user)):
    return user
