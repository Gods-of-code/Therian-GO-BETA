from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.db import connect_db, close_db
from app.ensure_indexes import ensure_indexes
from app.routes import users, profiles, matches, auth, likes, messages


@asynccontextmanager
async def lifespan(application: FastAPI):
    await connect_db()
    await ensure_indexes()
    yield
    await close_db()


app = FastAPI(
    title="Therian Dating API",
    description="API para la app de citas therian",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(profiles.router)
app.include_router(likes.router)
app.include_router(matches.router)
app.include_router(messages.router)


@app.get("/")
async def root():
    return {"status": "ok", "message": "Therian API corriendo"}