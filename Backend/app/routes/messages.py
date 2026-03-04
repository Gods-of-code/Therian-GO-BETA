from fastapi import APIRouter, Depends, HTTPException, Query, status, WebSocket, WebSocketDisconnect
from bson import ObjectId
from datetime import datetime
from jose import jwt, JWTError

from app.db import get_db
from app.models.schemas import MessageCreate, MessageOut, UserPublic
from app.routes.auth import current_user, ALGORITHM, SECRET_KEY, _find_user_doc, _doc_to_user_public

router = APIRouter(prefix="/messages", tags=["Messages"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, match_id: str):
        await websocket.accept()
        if match_id not in self.active_connections:
            self.active_connections[match_id] = []
        self.active_connections[match_id].append(websocket)

    def disconnect(self, websocket: WebSocket, match_id: str):
        if match_id in self.active_connections:
            if websocket in self.active_connections[match_id]:
                self.active_connections[match_id].remove(websocket)
            if not self.active_connections[match_id]:
                del self.active_connections[match_id]

    async def broadcast_to_match(self, match_id: str, message: dict):
        if match_id in self.active_connections:
            for connection in self.active_connections[match_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print("Error sending WS message:", e)

manager = ConnectionManager()

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
    
    msg_out = MessageOut(
        id=str(result.inserted_id),
        match_id=body.match_id,
        sender_profile=my_profile_id,
        body=msg_doc["body"],
        sent_at=now,
    )

    await manager.broadcast_to_match(body.match_id, {
        "id": msg_out.id,
        "match_id": msg_out.match_id,
        "sender_profile": msg_out.sender_profile,
        "body": msg_out.body,
        "sent_at": msg_out.sent_at.isoformat()
    })

    return msg_out

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

    await _validate_match_participant(match_id, my_profile_id)

    results = []
    cursor = (
        db["messages"]
        .find({"match_id": match_id})
        .sort("sent_at", 1)
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

@router.websocket("/ws/{match_id}")
async def websocket_endpoint(websocket: WebSocket, match_id: str, token: str = Query(...)):
    credential_exception = Exception("Invalid token")
    user_doc = None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credential_exception
        user_doc_item = await _find_user_doc(username)
        if not user_doc_item:
            raise credential_exception
        user = _doc_to_user_public(user_doc_item)
    except Exception:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    db = get_db()
    profile = await db["profiles"].find_one({"user_id": user.id_user})
    if not profile:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
        
    profile_id = str(profile["_id"])
    
    try:
        await _validate_match_participant(match_id, profile_id)
    except HTTPException:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await manager.connect(websocket, match_id)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, match_id)

