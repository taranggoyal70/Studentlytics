"""
Simplified backend for authentication only
Run this with: uvicorn main_auth:app --reload --port 8000
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router

app = FastAPI(title="Studentlytics Auth API", version="1.0.0")

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:3006,http://127.0.0.1:3006"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication routes
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])

@app.get("/")
def root():
    return {"message": "Studentlytics Authentication API", "status": "running"}

@app.get("/health")
def health():
    return {"status": "ok", "service": "auth"}
