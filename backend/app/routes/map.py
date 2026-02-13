from fastapi import APIRouter, Depends
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Item
import folium
from folium import plugins

router = APIRouter(prefix="/map", tags=["map"])

# Default campus coordinates (adjust for your campus)
DEFAULT_LAT = 12.9716
DEFAULT_LON = 77.5946

@router.get("/generate", response_class=HTMLResponse)
def generate_map(db: Session = Depends(get_db)):
    """Generate Folium map with all item markers"""
    from app.models import SecurityPoint, Building
    
    # Get all items
    items = db.query(Item).all()
    
    # Create map centered on campus
    m = folium.Map(
        location=[DEFAULT_LAT, DEFAULT_LON],
        zoom_start=15,
        tiles='OpenStreetMap'
    )
    
    # Add markers for each item
    for item in items:
        # Choose color based on status
        color = 'red' if item.status == 'stored' else 'yellow'
        
        # Get building and security point names
        building_name = 'N/A'
        security_point_name = 'N/A'
        
        if item.security_point_id:
            security_point = db.query(SecurityPoint).filter(SecurityPoint.id == item.security_point_id).first()
            if security_point:
                security_point_name = security_point.name or 'N/A'
                if security_point.building_id:
                    building = db.query(Building).filter(Building.id == security_point.building_id).first()
                    if building:
                        building_name = building.name or 'N/A'
        
        # Create popup content
        popup_html = f"""
        <div style="width: 200px;">
            <h4>{item.title}</h4>
            <p><strong>Building:</strong> {building_name}</p>
            <p><strong>Security Point:</strong> {security_point_name}</p>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Code:</strong> {item.item_code}</p>
        </div>
        """
        
        folium.Marker(
            [item.latitude, item.longitude],
            popup=folium.Popup(popup_html, max_width=250),
            tooltip=item.title,
            icon=folium.Icon(color=color, icon='info-sign')
        ).add_to(m)
    
    # Return map as HTML
    return m._repr_html_()

