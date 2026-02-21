from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from datetime import datetime
from pymongo.errors import DuplicateKeyError

from app.db import get_db
from app.models.schemas import LikeCreate, LikeOut, MatchOut, UserPublic
from app.routes.auth import current_user

router = APIRouter(prefix="/likes", tags=["Likes"])


async def _get_my_profile(user: UserPublic):
    db = get_db()
    profile = await db["profiles"].find_one({"user_id": user.id_user})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Necesitas crear tu perfil antes de dar likes",
        )
    return profile


def _make_match_key(id_a: str, id_b: str) -> str:
    return f"{min(id_a, id_b)}_{max(id_a, id_b)}"


@router.post("/", response_model=LikeOut, status_code=status.HTTP_201_CREATED)
async def give_like(
    body: LikeCreate,
    user: UserPublic = Depends(current_user),
):
    db = get_db()

    my_profile = await _get_my_profile(user)
    my_profile_id = str(my_profile["_id"])

    # No darte like a ti mismo
    if my_profile_id == body.to_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes darte like a ti mismo",
        )

    # Verificar que el perfil destino exista
    target = await db["profiles"].find_one({"_id": ObjectId(body.to_profile)})
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El perfil al que quieres dar like no existe",
        )

    now = datetime.utcnow()

    # Insertar el like previene duplicados
    try:
        result = await db["likes"].insert_one({
            "from_profile": my_profile_id,
            "to_profile": body.to_profile,
            "created_at": now,
        })
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya le diste like a este perfil",
        )

    # verificar si hay match recíproco
    reciprocal = await db["likes"].find_one({
        "from_profile": body.to_profile,
        "to_profile": my_profile_id,
    })

    if reciprocal:
        match_key = _make_match_key(my_profile_id, body.to_profile)
        try:
            await db["matches"].insert_one({
                "match_key": match_key,
                "profiles": sorted([my_profile_id, body.to_profile]),
                "created_at": now,
            })
        except DuplicateKeyError:
            pass 

    return LikeOut(
        id=str(result.inserted_id),
        from_profile=my_profile_id,
        to_profile=body.to_profile,
        created_at=now,
    )


@router.get("/", response_model=list[LikeOut])
async def get_my_likes(user: UserPublic = Depends(current_user)):
    db = get_db()
    my_profile = await _get_my_profile(user)
    my_profile_id = str(my_profile["_id"])

    results = []
    async for doc in db["likes"].find({"from_profile": my_profile_id}).sort("created_at", -1):
        results.append(LikeOut(
            id=str(doc["_id"]),
            from_profile=doc["from_profile"],
            to_profile=doc["to_profile"],
            created_at=doc["created_at"],
        ))

    return results


@router.get("/received", response_model=list[LikeOut])
async def get_likes_received(user: UserPublic = Depends(current_user)):
    db = get_db()
    my_profile = await _get_my_profile(user)
    my_profile_id = str(my_profile["_id"])

    results = []
    async for doc in db["likes"].find({"to_profile": my_profile_id}).sort("created_at", -1):
        results.append(LikeOut(
            id=str(doc["_id"]),
            from_profile=doc["from_profile"],
            to_profile=doc["to_profile"],
            created_at=doc["created_at"],
        ))

    return results
