from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Claim, Item
from pydantic import BaseModel
from typing import Optional, List
import os
import shutil

router = APIRouter(prefix="/claims", tags=["claims"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ClaimRequest(BaseModel):
    item_id: int
    registration_number: str
    college_details: str
    hidden_detail_entered: str

class ClaimResponse(BaseModel):
    id: int
    item_id: int
    claimed_by: int
    registration_number: str
    college_details: str
    claim_time: str
    verification_result: Optional[str]
    
    class Config:
        from_attributes = True

class ClaimVerify(BaseModel):
    claim_id: int
    verification_result: str  # verified, rejected

@router.post("/request", response_model=ClaimResponse)
def request_claim(
    claim_data: ClaimRequest,
    db: Session = Depends(get_db)
):
    """Request to claim an item"""
    item = db.query(Item).filter(Item.id == claim_data.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if item.status == "claimed":
        raise HTTPException(status_code=400, detail="Item already claimed")
    
    # Verify hidden detail
    if claim_data.hidden_detail_entered != item.hidden_detail:
        raise HTTPException(status_code=400, detail="Verification detail does not match")
    
    # Create claim request
    claim = Claim(
        item_id=claim_data.item_id,
        claimed_by=None,  # No authentication, so no user ID
        registration_number=claim_data.registration_number,
        college_details=claim_data.college_details,
        hidden_detail_entered=claim_data.hidden_detail_entered,
        verification_result=None
    )
    
    db.add(claim)
    db.commit()
    db.refresh(claim)
    
    return claim

@router.post("/verify")
def verify_claim(
    verify_data: ClaimVerify,
    db: Session = Depends(get_db)
):
    """Verify a claim"""
    claim = db.query(Claim).filter(Claim.id == verify_data.claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    claim.verification_result = verify_data.verification_result
    claim.security_officer_id = None  # No authentication, so no user ID
    
    if verify_data.verification_result == "verified":
        # Update item status
        item = db.query(Item).filter(Item.id == claim.item_id).first()
        if item:
            item.status = "claimed"
    
    db.commit()
    
    return {"message": "Claim verified", "claim": ClaimResponse.model_validate(claim)}

@router.post("/upload-pickup-photo")
async def upload_pickup_photo(
    claim_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload pickup photo for high-value items"""
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    item = db.query(Item).filter(Item.id == claim.item_id).first()
    if not item or not item.is_high_value:
        raise HTTPException(status_code=400, detail="Photo only required for high-value items")
    
    # Save file
    file_ext = os.path.splitext(file.filename)[1]
    filename = f"pickup_{claim.id}{file_ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    claim.pickup_photo_path = filepath
    db.commit()
    
    return {"message": "Pickup photo uploaded", "path": filepath}

@router.get("", response_model=List[ClaimResponse])
def get_claims(
    item_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get all claims"""
    query = db.query(Claim)
    
    if item_id:
        query = query.filter(Claim.item_id == item_id)
    
    return query.order_by(Claim.claim_time.desc()).all()

