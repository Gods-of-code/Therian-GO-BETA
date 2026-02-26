# app/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from dotenv import load_dotenv
from pathlib import Path
import os
import hashlib
import secrets

from app.db import get_db
from app.models.schemas import (
    UserCreate, UserDB, UserPublic, 
    TokenResponse, RefreshRequest,
    ForgotPasswordRequest, ResetPasswordRequest,
    RefreshTokenDB, PasswordResetTokenDB
)
from app.services.email import EmailService

# ── Configuración ────────────────────────────────────
env_path = Path(__file__).resolve().parent.parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY no está configurada en el archivo .env")

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2 = OAuth2PasswordBearer(tokenUrl="/auth/login")
crypt = CryptContext(schemes=["bcrypt"])

# ── Helpers de búsqueda ──────────────────────────────
async def _find_user_doc(identifier: str):
    db = get_db()
    return await db["users"].find_one(
        {"$or": [{"username": identifier}, {"email": identifier}]}
    )

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
        token_type = payload.get("type")
        
        if username is None or token_type != "access":
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

# ── Helpers de tokens ─────────────────────────────────
async def create_tokens_for_user(username: str, user_id: str, request: Request = None) -> dict:
    """Crea access token y refresh token para un usuario"""
    db = get_db()
    
    # 1. Access token (corto)
    access_expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode(
        {"sub": username, "exp": access_expire, "type": "access"},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
    
    # 2. Refresh token (largo y revocable)
    refresh_token_str = secrets.token_urlsafe(64)
    token_hash = hashlib.sha256(refresh_token_str.encode()).hexdigest()
    refresh_expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    # Información del dispositivo (opcional)
    device_info = None
    if request:
        device_info = f"{request.client.host} | {request.headers.get('user-agent', 'unknown')}"
    
    # Guardar refresh token en DB
    refresh_doc = {
        "user_id": user_id,
        "token_hash": token_hash,
        "expires_at": refresh_expire,
        "revoked": False,
        "created_at": datetime.utcnow(),
        "device_info": device_info
    }
    await db["refresh_tokens"].insert_one(refresh_doc)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token_str,
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60  # en segundos
    }

async def revoke_refresh_token(token: str):
    """Revoca un refresh token específico"""
    db = get_db()
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    await db["refresh_tokens"].update_one(
        {"token_hash": token_hash},
        {"$set": {"revoked": True, "revoked_at": datetime.utcnow()}}
    )

async def revoke_all_user_tokens(user_id: str):
    """Revoca todos los refresh tokens de un usuario"""
    db = get_db()
    await db["refresh_tokens"].update_many(
        {"user_id": user_id, "revoked": False},
        {"$set": {"revoked": True, "revoked_at": datetime.utcnow()}}
    )

# ── Endpoints ─────────────────────────────────────────
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

@router.post("/login", response_model=TokenResponse)
async def login(
    form: OAuth2PasswordRequestForm = Depends(),
    request: Request = None
):
    """Login con refresh token"""
    doc = await _find_user_doc(form.username)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
        )

    if not crypt.verify(form.password, doc["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
        )

    # Crear ambos tokens
    tokens = await create_tokens_for_user(
        username=doc["username"],
        user_id=str(doc["_id"]),
        request=request
    )

    return {
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"],
        "token_type": "bearer",
        "expires_in": tokens["expires_in"]
    }

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_req: RefreshRequest,
    request: Request = None
):
    """Obtener nuevo access token usando refresh token"""
    db = get_db()
    
    # Hashear el token recibido para buscar en DB
    token_hash = hashlib.sha256(refresh_req.refresh_token.encode()).hexdigest()
    
    # Buscar token válido
    token_doc = await db["refresh_tokens"].find_one({
        "token_hash": token_hash,
        "revoked": False,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if not token_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido o expirado"
        )
    
    # Buscar usuario
    user_doc = await db["users"].find_one({"_id": token_doc["user_id"]})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado"
        )
    
    # Rotación de refresh tokens (más seguro)
    await revoke_refresh_token(refresh_req.refresh_token)
    
    # Crear nuevos tokens
    tokens = await create_tokens_for_user(
        username=user_doc["username"],
        user_id=str(user_doc["_id"]),
        request=request
    )
    
    return {
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"],
        "token_type": "bearer",
        "expires_in": tokens["expires_in"]
    }

@router.post("/logout")
async def logout(refresh_req: RefreshRequest, user: UserPublic = Depends(auth_user)):
   
    """Cerrar sesión revocando el refresh token"""
    await revoke_refresh_token(refresh_req.refresh_token)
    return {"message": "Sesión cerrada exitosamente"}

@router.post("/logout-all")
async def logout_all(user: UserPublic = Depends(auth_user)):
    
    """Cerrar sesión en todos los dispositivos"""
    await revoke_all_user_tokens(user.id_user)
    return {"message": "Sesión cerrada en todos los dispositivos"}

@router.get("/me", response_model=UserPublic)
async def read_current_user(user: UserPublic = Depends(current_user)):
    return user

# ── Recuperación de contraseña ────────────────────────
@router.post("/forgot-password")
async def forgot_password(request_data: ForgotPasswordRequest):
   
    """Solicitar recuperación de contraseña"""
    db = get_db() 
    
    # Buscar usuario por email
    user_doc = await db["users"].find_one({"email": request_data.email})
    
    # Por seguridad, siempre responder igual aunque el email no exista
    if not user_doc:
        print(f"Intento de recuperación para email no registrado: {request_data.email}")
        return {"message": "Si el email está registrado, recibirás instrucciones"}
    
    # Generar token de recuperación
    token = secrets.token_urlsafe(48)
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    expires_at = datetime.utcnow() + timedelta(hours=24)
    
    # Guardar token en DB
    reset_doc = {
        "email": request_data.email,
        "token_hash": token_hash,
        "expires_at": expires_at,
        "used": False,
        "created_at": datetime.utcnow()
    }
    await db["password_reset_tokens"].insert_one(reset_doc)
    
    # Enviar email
    await EmailService.send_password_reset(
        email=request_data.email,
        token=token,
        username=user_doc.get("username", "Usuario")
    )
    
    return {"message": "Si el email está registrado, recibirás instrucciones"}

@router.post("/reset-password")
async def reset_password(request_data: ResetPasswordRequest):
    
    #Restablecer contraseña usando token
    db = get_db()   
    
    # Hashear token recibido
    token_hash = hashlib.sha256(request_data.token.encode()).hexdigest()
    
    # Buscar token válido
    reset_doc = await db["password_reset_tokens"].find_one({
        "token_hash": token_hash,
        "used": False,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if not reset_doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token inválido o expirado"
        )
    
    # Actualizar contraseña
    new_password_hash = crypt.hash(request_data.new_password)
    await db["users"].update_one(
        {"email": reset_doc["email"]},
        {"$set": {"password_hash": new_password_hash}}
    )
    
    # Marcar token como usado
    await db["password_reset_tokens"].update_one(
        {"_id": reset_doc["_id"]},
        {"$set": {"used": True}}
    )
    
    # Revocar todos los refresh tokens del usuario (por seguridad)
    user_doc = await db["users"].find_one({"email": reset_doc["email"]})
    if user_doc:
        await revoke_all_user_tokens(str(user_doc["_id"]))
    
    return {"message": "Contraseña actualizada exitosamente"}

@router.post("/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    user: UserPublic = Depends(current_user)
):  
    #Cambiar contraseña (usuario autenticado)
    db = get_db()   
    
    # Verificar contraseña actual
    user_doc = await db["users"].find_one({"_id": user.id_user})
    if not crypt.verify(current_password, user_doc["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contraseña actual incorrecta"
        )
    
    # Validar nueva contraseña (básico)
    if len(new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La nueva contraseña debe tener al menos 8 caracteres"
        )
    
    # Actualizar
    new_hash = crypt.hash(new_password)
    await db["users"].update_one(
        {"_id": user.id_user},
        {"$set": {"password_hash": new_hash}}
    )
    
    # Revocar todos los refresh tokens (forzar relogin)
    await revoke_all_user_tokens(user.id_user)
    
    return {"message": "Contraseña actualizada exitosamente"}