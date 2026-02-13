from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    password_hash = Column(String)  # Store hashed password
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Building(Base):
    __tablename__ = "buildings"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    
    security_points = relationship("SecurityPoint", back_populates="building")

class SecurityPoint(Base):
    __tablename__ = "security_points"
    
    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"))
    name = Column(String)
    
    building = relationship("Building", back_populates="security_points")
    items = relationship("Item", back_populates="security_point")

class Item(Base):
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    item_code = Column(String, unique=True, index=True)
    title = Column(String)
    description = Column(Text)
    category = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    building_id = Column(Integer, ForeignKey("buildings.id"))
    security_point_id = Column(Integer, ForeignKey("security_points.id"))
    place_details = Column(String)  # classroom, lab, corridor, etc.
    found_at = Column(DateTime(timezone=True))
    reported_by = Column(Integer, ForeignKey("users.id"))
    hidden_detail = Column(String)  # Verification detail
    image_path = Column(String, nullable=True)
    status = Column(String, default="stored")  # stored, claimed
    is_high_value = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    security_point = relationship("SecurityPoint", back_populates="items")
    claims = relationship("Claim", back_populates="item")

class Claim(Base):
    __tablename__ = "claims"
    
    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"))
    claimed_by = Column(Integer, ForeignKey("users.id"))
    registration_number = Column(String)
    college_details = Column(Text)
    claim_time = Column(DateTime(timezone=True), server_default=func.now())
    hidden_detail_entered = Column(String)
    verification_result = Column(String, nullable=True)  # verified, rejected
    pickup_photo_path = Column(String, nullable=True)
    security_officer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    item = relationship("Item", back_populates="claims")

