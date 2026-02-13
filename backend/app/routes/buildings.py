from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Building, SecurityPoint
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/buildings", tags=["buildings"])

class BuildingResponse(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True

class SecurityPointResponse(BaseModel):
    id: int
    building_id: int
    name: str
    
    class Config:
        from_attributes = True

@router.get("", response_model=List[BuildingResponse])
def get_buildings(db: Session = Depends(get_db)):
    """Get all buildings"""
    buildings = db.query(Building).all()
    return buildings

@router.get("/security-points", response_model=List[SecurityPointResponse])
def get_security_points(building_id: int = Query(None), db: Session = Depends(get_db)):
    """Get security points, optionally filtered by building"""
    query = db.query(SecurityPoint)
    if building_id:
        query = query.filter(SecurityPoint.building_id == building_id)
    return query.all()

