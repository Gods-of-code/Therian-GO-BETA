"""
Crea de forma idempotente todos los índices necesarios en MongoDB.
Puede ejecutarse como script independiente o importarse desde el lifespan.

Si un índice ya existe con opciones diferentes (por ejemplo, se le agregó unique),
se elimina el viejo y se recrea con las nuevas opciones.
"""

import asyncio
from pymongo.errors import OperationFailure
from app.db import connect_db, close_db, get_db


# ── Definición de índices ─────────────────────────────────────

INDEXES = [
    # users
    {
        "collection": "users",
        "keys": [("email", 1)],
        "options": {"unique": True, "name": "ix_users_email_unique"},
    },
    {
        "collection": "users",
        "keys": [("username", 1)],
        "options": {"unique": True, "name": "ix_users_username_unique"},
    },

    # profiles
    {
        "collection": "profiles",
        "keys": [("user_id", 1)],
        "options": {"unique": True, "name": "ix_profiles_user_id"},
    },
    {
        "collection": "profiles",
        "keys": [("location", "2dsphere")],
        "options": {"name": "ix_profiles_location_2dsphere"},
    },
    {
        "collection": "profiles",
        "keys": [("display_name", "text"), ("bio", "text")],
        "options": {"name": "ix_profiles_text_name_bio"},
    },

    # likes
    {
        "collection": "likes",
        "keys": [("from_profile", 1), ("to_profile", 1)],
        "options": {"unique": True, "name": "ix_likes_from_to_unique"},
    },

    # matches
    {
        "collection": "matches",
        "keys": [("match_key", 1)],
        "options": {"unique": True, "name": "ix_matches_match_key_unique"},
    },
    {
        "collection": "matches",
        "keys": [("profiles", 1)],
        "options": {"name": "ix_matches_profiles"},
    },

    # messages
    {
        "collection": "messages",
        "keys": [("match_id", 1), ("sent_at", -1)],
        "options": {"name": "ix_messages_match_sentat"},
    },
    {
        "collection": "messages",
        "keys": [("sender_profile", 1)],
        "options": {"name": "ix_messages_sender"},
    },

    # catalogs
    {
        "collection": "catalogs",
        "keys": [("type", 1), ("code_name", 1)],
        "options": {"unique": True, "name": "ix_catalogs_type_code_unique"},
    },

    # REFRESH TOKENS
    {
        "collection": "refresh_tokens",
        "keys": [("token_hash", 1)],
        "options": {"unique": True, "name": "ix_refresh_tokens_token_hash_unique"},
    },
    {
        "collection": "refresh_tokens",
        "keys": [("user_id", 1)],
        "options": {"name": "ix_refresh_tokens_user_id"},
    },
    {
        "collection": "refresh_tokens",
        "keys": [("expires_at", 1)],
        "options": {"expireAfterSeconds": 0, "name": "ix_refresh_tokens_expires_at_ttl"},
    },

    # PASSWORD RESET
    {
        "collection": "password_reset_tokens",
        "keys": [("token_hash", 1)],
        "options": {"unique": True, "name": "ix_password_reset_tokens_token_hash_unique"},
    },
    {
        "collection": "password_reset_tokens",
        "keys": [("expires_at", 1)],
        "options": {"expireAfterSeconds": 0, "name": "ix_password_reset_tokens_expires_at_ttl"},
    },
]


async def ensure_indexes(standalone: bool = False):
    """
    Crea los índices. Si standalone=True, abre y cierra la conexión;
    si no, asume que la conexión ya está activa (llamado desde lifespan).
    """
    if standalone:
        await connect_db()

    db = get_db()

    for idx in INDEXES:
        col = db[idx["collection"]]
        try:
            await col.create_index(idx["keys"], **idx["options"])
        except OperationFailure as e:
            # Conflicto: mismo nombre pero opciones distintas → recrear
            if e.code in (85, 86):
                await col.drop_index(idx["options"]["name"])
                await col.create_index(idx["keys"], **idx["options"])
            else:
                raise

    print("Todos los índices creados/verificados correctamente.")

    if standalone:
        await close_db()


if __name__ == "__main__":
    asyncio.run(ensure_indexes(standalone=True))