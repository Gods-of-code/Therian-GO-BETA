from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from app.models.schemas import UserPublic
from app.db import get_db
from app.routes.auth import current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserPublic)
async def get_my_user(user: UserPublic = Depends(current_user)):
    return user


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_account(user: UserPublic = Depends(current_user)):
    db = get_db()

    # Obtener perfil (puede no existir si nunca lo creó)
    profile = await db["profiles"].find_one({"user_id": user.id_user})

    if profile:
        profile_id = str(profile["_id"])

        # Buscar matches donde participa
        match_ids = []
        async for match_doc in db["matches"].find({"profiles": profile_id}):
            match_ids.append(str(match_doc["_id"]))

        # Eliminar mensajes de esos matches
        if match_ids:
            await db["messages"].delete_many({"match_id": {"$in": match_ids}})

        # Eliminar matches
        await db["matches"].delete_many({"profiles": profile_id})

        # Eliminar likes
        await db["likes"].delete_many({
            "$or": [
                {"from_profile": profile_id},
                {"to_profile": profile_id},
            ]
        })

        # Eliminar perfil
        await db["profiles"].delete_one({"_id": profile["_id"]})

    # Eliminar usuario
    await db["users"].delete_one({"_id": ObjectId(user.id_user)})
