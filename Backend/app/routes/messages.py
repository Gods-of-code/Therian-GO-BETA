from fastapi import APIRouter, Depends, HTTPException, Query, status
from bson import ObjectId
from datetime import datetime

from app.db import get_db
from app.models.schemas import MessageCreate, MessageOut, UserPublic
from app.routes.auth import current_user

router = APIRouter(prefix="/messages", tags=["Messages"])


async def _get_my_profile(user: UserPublic):
    db = get_db()
    profile = await db["profiles"].find_one({"user_id": user.id_user})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Necesitas crear tu perfil primero",
        )
    return profile


async def _validate_match_participant(match_id: str, profile_id: str):
    db = get_db()
    match_doc = await db["matches"].find_one({"_id": ObjectId(match_id)})
    if not match_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match no encontrado",
        )

    if profile_id not in match_doc["profiles"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No eres participante de este match. No puedes enviar ni leer mensajes.",
        )

    return match_doc


@router.post("/", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
async def send_message(
    body: MessageCreate,
    user: UserPublic = Depends(current_user),
):
    db = get_db()
    my_profile = await _get_my_profile(user)
    my_profile_id = str(my_profile["_id"])
    await _validate_match_participant(body.match_id, my_profile_id)

    if not body.body.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El mensaje no puede estar vacío",
        )

    now = datetime.utcnow()
    msg_doc = {
        "match_id": body.match_id,
        "sender_profile": my_profile_id,
        "body": body.body.strip(),
        "sent_at": now,
    }

    result = await db["messages"].insert_one(msg_doc)

    return MessageOut(
        id=str(result.inserted_id),
        match_id=body.match_id,
        sender_profile=my_profile_id,
        body=msg_doc["body"],
        sent_at=now,
    )


@router.get("/", response_model=list[MessageOut])
async def get_messages(
    match_id: str = Query(..., description="ID del match"),
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0),
    user: UserPublic = Depends(current_user),
):
    db = get_db()
    my_profile = await _get_my_profile(user)
    my_profile_id = str(my_profile["_id"])

    # Validar que sea participante del match
    await _validate_match_participant(match_id, my_profile_id)

    results = []
    cursor = (
        db["messages"]
        .find({"match_id": match_id})
        .sort("sent_at", -1)
        .skip(skip)
        .limit(limit)
    )
    async for doc in cursor:
        results.append(MessageOut(
            id=str(doc["_id"]),
            match_id=doc["match_id"],
            sender_profile=doc["sender_profile"],
            body=doc["body"],
            sent_at=doc["sent_at"],
        ))

    return results
