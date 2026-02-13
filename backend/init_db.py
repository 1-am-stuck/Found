"""
Database initialization script
Run this to populate the database with sample buildings and security points
"""
from app.database import SessionLocal, init_db
from app.models import Building, SecurityPoint

def init_sample_data():
    """Initialize database with sample data"""
    # Initialize database tables
    init_db()
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(Building).count() > 0:
            print("Database already has data. Skipping initialization.")
            return
        
        # Add buildings
        buildings_data = [
            {"name": "Main Building"},
            {"name": "Science Block"},
            {"name": "Library"},
            {"name": "Engineering Block"},
            {"name": "Administration Building"},
        ]
        
        buildings = []
        for building_data in buildings_data:
            building = Building(**building_data)
            db.add(building)
            buildings.append(building)
        
        db.commit()
        
        # Refresh to get IDs
        for building in buildings:
            db.refresh(building)
        
        # Add security points
        security_points_data = [
            {"building_id": 1, "name": "Main Entrance"},
            {"building_id": 1, "name": "Reception Desk"},
            {"building_id": 2, "name": "Lab Security"},
            {"building_id": 2, "name": "Science Block Reception"},
            {"building_id": 3, "name": "Library Front Desk"},
            {"building_id": 4, "name": "Engineering Reception"},
            {"building_id": 5, "name": "Admin Reception"},
        ]
        
        for point_data in security_points_data:
            security_point = SecurityPoint(**point_data)
            db.add(security_point)
        
        db.commit()
        
        print("Database initialized successfully!")
        print(f"Created {len(buildings)} buildings")
        print(f"Created {len(security_points_data)} security points")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_sample_data()

