import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./campus_found.db"
    ALLOWED_EMAIL_DOMAIN: str = "@campus.edu"  # Optional: set to "" to allow any email
    ADMIN_EMAILS: str = "admin@campus.edu"  # Comma-separated
    JWT_SECRET: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()

