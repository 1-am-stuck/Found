from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routes import items, claims, admin, buildings, map

app = FastAPI(title="Campus FOUND System", version="1.0.0")

# CORS middleware
# Update allow_origins with your frontend URL in production
cors_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
# Add production frontend URL from environment variable if set
import os
if os.getenv("FRONTEND_URL"):
    cors_origins.append(os.getenv("FRONTEND_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(buildings.router)
app.include_router(items.router)
app.include_router(claims.router)
app.include_router(admin.router)
app.include_router(map.router)

@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/")
def root():
    return {"message": "Campus FOUND System API"}

