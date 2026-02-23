from fastapi import APIRouter, Depends, HTTPException, Query, status
from bson import ObjectId
from datetime import datetime

from app.db import get_db
from app.models.schemas import ProfileCreate, ProfileUpdate, ProfileOut
from app.routes.auth import current_user
from app.models.schemas import UserPublic

router = APIRouter(prefix="/profiles", tags=["Profiles"])


# ── Helpers ───────────────────────────────────────────────────

def _doc_to_profile(doc: dict) -> ProfileOut:
    doc["id"] = str(doc.pop("_id"))
    return ProfileOut(**doc)


async def _get_profile_by_user(user_id: str):
    db = get_db()
    return await db["profiles"].find_one({"user_id": user_id})


# ── Endpoints ─────────────────────────────────────────────────

@router.post("/", response_model=ProfileOut, status_code=status.HTTP_201_CREATED)
async def create_profile(
    body: ProfileCreate,
    user: UserPublic = Depends(current_user),
):
    db = get_db()

    # Un perfil por usuario
    existing = await db["profiles"].find_one({"user_id": user.id_user})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya tienes un perfil creado",
        )

    now = datetime.utcnow()
    profile_doc = {
        "user_id": user.id_user,
        "display_name": body.display_name,
        "birth_date": body.birth_date.isoformat(),
        "gender": body.gender,
        "bio": body.bio,
        "height_cm": body.height_cm,
        "therian_identities": body.therian_identities,
        "goal_ids": body.goal_ids,
        "location": body.location.model_dump() if body.location else None,
        "created_at": now,
        "updated_at": now,
    }

    result = await db["profiles"].insert_one(profile_doc)
    profile_doc["_id"] = result.inserted_id
    return _doc_to_profile(profile_doc)


@router.get("/me", response_model=ProfileOut)
async def get_my_profile(user: UserPublic = Depends(current_user)):
    doc = await _get_profile_by_user(user.id_user)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No tienes un perfil aún. Créalo primero.",
        )
    return _doc_to_profile(doc)


@router.put("/me", response_model=ProfileOut)
async def update_my_profile(
    body: ProfileUpdate,
    user: UserPublic = Depends(current_user),
):
    db = get_db()
    doc = await _get_profile_by_user(user.id_user)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No tienes un perfil aún. Créalo primero.",
        )

    updates: dict = {}
    for field, value in body.model_dump(exclude_unset=True).items():
        if field == "location" and value is not None:
            updates["location"] = value
        else:
            updates[field] = value
    updates["updated_at"] = datetime.utcnow()

    await db["profiles"].update_one(
        {"_id": doc["_id"]},
        {"$set": updates},
    )

    updated = await db["profiles"].find_one({"_id": doc["_id"]})
    return _doc_to_profile(updated)


@router.get("/near", response_model=list[ProfileOut])
async def search_nearby(
    lng: float = Query(..., description="Longitud del punto de búsqueda"),
    lat: float = Query(..., description="Latitud del punto de búsqueda"),
    max_km: float = Query(50, description="Radio máximo en km"),
    limit: int = Query(20, ge=1, le=100),
    user: UserPublic = Depends(current_user),
):
    db = get_db()

    pipeline = [
        {
            "$geoNear": {
                "near": {"type": "Point", "coordinates": [lng, lat]},
                "distanceField": "distance_m",
                "maxDistance": max_km * 1000,   # metros
                "spherical": True,
            }
        },
        {"$match": {"user_id": {"$ne": user.id_user}}},
        {"$limit": limit},
    ]

    results = []
    async for doc in db["profiles"].aggregate(pipeline):
        results.append(_doc_to_profile(doc))

    return results


@router.get("/{profile_id}", response_model=ProfileOut)
async def get_profile(
    profile_id: str,
    _user: UserPublic = Depends(current_user),
):
    db = get_db()
    doc = await db["profiles"].find_one({"_id": ObjectId(profile_id)})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil no encontrado",
        )
    return _doc_to_profile(doc)
