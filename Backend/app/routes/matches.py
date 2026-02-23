from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from datetime import datetime

from app.db import get_db
from app.models.schemas import MatchOut, UserPublic
from app.routes.auth import current_user

router = APIRouter(prefix="/matches", tags=["Matches"])


async def _get_my_profile(user: UserPublic):
    db = get_db()
    profile = await db["profiles"].find_one({"user_id": user.id_user})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Necesitas crear tu perfil primero",
        )
    return profile


@router.get("/", response_model=list[MatchOut])
async def get_my_matches(user: UserPublic = Depends(current_user)):
    db = get_db()
    my_profile = await _get_my_profile(user)
    my_profile_id = str(my_profile["_id"])

    results = []
    async for doc in db["matches"].find(
        {"profiles": my_profile_id}
    ).sort("created_at", -1):
        results.append(MatchOut(
            id=str(doc["_id"]),
            match_key=doc["match_key"],
            profiles=doc["profiles"],
            created_at=doc["created_at"],
        ))

    return results


@router.get("/{match_id}", response_model=MatchOut)
async def get_match(
    match_id: str,
    user: UserPublic = Depends(current_user),
):
    db = get_db()
    my_profile = await _get_my_profile(user)
    my_profile_id = str(my_profile["_id"])

    doc = await db["matches"].find_one({"_id": ObjectId(match_id)})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match no encontrado",
        )

    if my_profile_id not in doc["profiles"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes acceso a este match",
        )

    return MatchOut(
        id=str(doc["_id"]),
        match_key=doc["match_key"],
        profiles=doc["profiles"],
        created_at=doc["created_at"],
    )


@router.delete("/{match_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unmatch(
    match_id: str,
    user: UserPublic = Depends(current_user),
):
    db = get_db()
    my_profile = await _get_my_profile(user)
    my_profile_id = str(my_profile["_id"])

    doc = await db["matches"].find_one({"_id": ObjectId(match_id)})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match no encontrado",
        )

    if my_profile_id not in doc["profiles"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes acceso a este match",
        )

    other_profile_id = [p for p in doc["profiles"] if p != my_profile_id][0]

    await db["matches"].delete_one({"_id": doc["_id"]})

    await db["likes"].delete_many({
        "$or": [
            {"from_profile": my_profile_id, "to_profile": other_profile_id},
            {"from_profile": other_profile_id, "to_profile": my_profile_id},
        ]
    })

    await db["messages"].delete_many({"match_id": str(doc["_id"])})
