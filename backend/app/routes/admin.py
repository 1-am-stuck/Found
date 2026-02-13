from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Item, Claim
from app.routes.items import ItemResponse
from app.routes.claims import ClaimResponse
from typing import List

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/items", response_model=List[ItemResponse])
def get_admin_items(
    security_point_id: int = None,
    db: Session = Depends(get_db)
):
    """Get all items, optionally filtered by security point"""
    query = db.query(Item)
    
    if security_point_id:
        query = query.filter(Item.security_point_id == security_point_id)
    
    return query.order_by(Item.created_at.desc()).all()

@router.get("/claims", response_model=List[ClaimResponse])
def get_admin_claims(
    db: Session = Depends(get_db)
):
    """Get all claims"""
    claims = db.query(Claim).order_by(Claim.claim_time.desc()).all()
    return claims

@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db)
):
    """Get dashboard statistics"""
    total_items = db.query(func.count(Item.id)).scalar()
    stored_items = db.query(func.count(Item.id)).filter(Item.status == "stored").scalar()
    claimed_items = db.query(func.count(Item.id)).filter(Item.status == "claimed").scalar()
    pending_claims = db.query(func.count(Claim.id)).filter(Claim.verification_result == None).scalar()
    
    return {
        "total_items": total_items,
        "stored_items": stored_items,
        "claimed_items": claimed_items,
        "pending_claims": pending_claims
    }

