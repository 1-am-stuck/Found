# Campus FOUND System - Backend

## Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update the following:
     - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
     - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
     - `ALLOWED_EMAIL_DOMAIN`: Campus email domain (e.g., `@campus.edu`)
     - `ADMIN_EMAILS`: Comma-separated list of admin emails
     - `JWT_SECRET`: A secure random string for JWT signing

3. **Google OAuth Setup:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000` (for development)
   - Copy Client ID and Client Secret to `.env`

4. **Run the server:**
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## Initialize Database

The database is automatically initialized on startup. To add initial data (buildings and security points):

**Option 1: Use the initialization script (Recommended)**
```bash
python init_db.py
```

This will create sample buildings and security points.

**Option 2: Use the API endpoints directly**
You can use the API to add buildings and security points programmatically.

**Option 3: Manual Python script**
```python
from app.database import SessionLocal
from app.models import Building, SecurityPoint

db = SessionLocal()

# Add buildings
building1 = Building(name="Main Building")
building2 = Building(name="Science Block")
db.add(building1)
db.add(building2)
db.commit()

# Add security points
security1 = SecurityPoint(building_id=1, name="Main Entrance")
security2 = SecurityPoint(building_id=1, name="Reception")
security3 = SecurityPoint(building_id=2, name="Lab Security")
db.add(security1)
db.add(security2)
db.add(security3)
db.commit()
```

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

- `POST /auth/google` - Google OAuth login
- `GET /auth/me` - Get current user
- `GET /buildings` - Get all buildings
- `GET /buildings/security-points` - Get security points
- `POST /items/report` - Report found item
- `GET /items` - Get all items (with filters)
- `GET /items/{id}` - Get specific item
- `POST /claims/request` - Request to claim item
- `POST /claims/verify` - Admin verify claim
- `GET /admin/items` - Admin view items
- `GET /admin/stats` - Admin statistics
- `GET /map/generate` - Generate Folium map HTML

