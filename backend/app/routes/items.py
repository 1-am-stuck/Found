from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Item
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import secrets
import os
import shutil

router = APIRouter(prefix="/items", tags=["items"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ItemCreate(BaseModel):
    title: str
    description: str
    category: str
    latitude: float
    longitude: float
    building_id: int
    security_point_id: int
    place_details: str
    found_at: str  # ISO format datetime string
    hidden_detail: str
    is_high_value: bool = False

class ItemResponse(BaseModel):
    id: int
    item_code: str
    title: str
    description: str
    category: str
    latitude: float
    longitude: float
    building_id: int
    security_point_id: int
    place_details: str
    found_at: datetime
    reported_by: int
    image_path: Optional[str]
    status: str
    is_high_value: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ItemUpdate(BaseModel):
    status: str

@router.post("/report", response_model=ItemResponse)
async def report_found_item(
    item_data: ItemCreate,
    db: Session = Depends(get_db)
):
    """Report a found item"""
    # Generate unique item code
    item_code = f"FOUND-{secrets.token_hex(4).upper()}"
    
    # Parse found_at datetime
    found_at = datetime.fromisoformat(item_data.found_at.replace('Z', '+00:00'))
    
    item = Item(
        item_code=item_code,
        title=item_data.title,
        description=item_data.description,
        category=item_data.category,
        latitude=item_data.latitude,
        longitude=item_data.longitude,
        building_id=item_data.building_id,
        security_point_id=item_data.security_point_id,
        place_details=item_data.place_details,
        found_at=found_at,
        reported_by=None,  # No authentication, so no user ID
        hidden_detail=item_data.hidden_detail,
        is_high_value=item_data.is_high_value,
        status="stored"
    )
    
    db.add(item)
    db.commit()
    db.refresh(item)
    
    return item

@router.post("/report/upload-photo")
async def upload_item_photo(
    item_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload photo for a found item"""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Save file
    file_ext = os.path.splitext(file.filename)[1]
    filename = f"{item.item_code}{file_ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    item.image_path = filepath
    db.commit()
    
    return {"message": "Photo uploaded", "path": filepath}

@router.get("", response_model=List[ItemResponse])
def get_items(
    category: Optional[str] = None,
    building_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all found items with optional filters"""
    query = db.query(Item)
    
    if category:
        query = query.filter(Item.category == category)
    if building_id:
        query = query.filter(Item.building_id == building_id)
    if status:
        query = query.filter(Item.status == status)
    
    return query.order_by(Item.created_at.desc()).all()

@router.get("/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):
    """Get a specific item (without hidden detail)"""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.put("/{item_id}/confirm_drop")
def confirm_drop(
    item_id: int,
    db: Session = Depends(get_db)
):
    """Confirm item has been dropped at security point"""
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    item.status = "stored"
    db.commit()
    
    return {"message": "Drop confirmed", "item": ItemResponse.model_validate(item)}

