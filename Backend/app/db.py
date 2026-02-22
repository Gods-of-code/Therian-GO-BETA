from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os

env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

MONGODB_URI: str = os.getenv("MONGODB_URI", "")
DATABASE_NAME: str = os.getenv("DATABASE_NAME", "therian_db")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI no está configurada en el archivo .env")

_client: AsyncIOMotorClient | None = None
_db = None


async def connect_db() -> None:
    global _client, _db
    _client = AsyncIOMotorClient(MONGODB_URI)
    _db = _client[DATABASE_NAME]
    await _client.admin.command("ping")
    print(f"Conectado a MongoDB — base de datos: '{DATABASE_NAME}'")


async def close_db() -> None:
    global _client, _db
    if _client is not None:
        _client.close()
        _client = None
        _db = None
        print("Conexión a MongoDB cerrada.")


def get_db():
    if _db is None:
        raise RuntimeError(
            "La base de datos no está conectada. "
            "Asegúrate de que FastAPI haya arrancado correctamente (lifespan)."
        )
    return _db