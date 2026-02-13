from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.auth import create_access_token, get_current_user, verify_password, get_password_hash
from app.config import settings
from datetime import timedelta
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["auth"])

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    name: str
    email: str
    is_admin: bool
    
    class Config:
        from_attributes = True

@router.post("/register", response_model=UserResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if username already exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email already exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check email domain if required
    if settings.ALLOWED_EMAIL_DOMAIN and not user_data.email.endswith(settings.ALLOWED_EMAIL_DOMAIN):
        raise HTTPException(
            status_code=403,
            detail=f"Email must be from {settings.ALLOWED_EMAIL_DOMAIN} domain"
        )
    
    # Check admin status
    admin_emails = [e.strip() for e in settings.ADMIN_EMAILS.split(",")] if settings.ADMIN_EMAILS else []
    is_admin = user_data.email in admin_emails
    
    # Create new user
    user = User(
        username=user_data.username,
        email=user_data.email,
        name=user_data.name,
        password_hash=get_password_hash(user_data.password),
        is_admin=is_admin
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

@router.post("/login")
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login with username and password"""
    user = db.query(User).filter(User.username == login_data.username).first()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create JWT token
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user)
    }

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse.model_validate(current_user)

