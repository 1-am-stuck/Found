# Campus FOUND System

A complete campus found items management system built for hackathon demonstration.

**🚀 [Deployment Guide](DEPLOYMENT.md)** - See `DEPLOYMENT.md` for detailed deployment instructions.

## System Overview

This system allows users to:
- Report found items on campus
- Browse found items
- Claim items with verification
- Admin dashboard for security officers

**Key Features:**
- Google OAuth authentication (campus email only)
- Interactive Folium map with item markers
- Mobile-style responsive UI
- No lost item reporting
- No AI matching
- Simple verification system

## Tech Stack

- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, SQLite/PostgreSQL
- **Frontend**: React.js, React Router
- **Maps**: Folium
- **Auth**: Google OAuth 2.0

## Project Structure

```
campus_found/
├── backend/          # FastAPI backend
├── frontend/         # React frontend
└── README.md         # This file
```

## Quick Start

**📖 For detailed step-by-step instructions, see [QUICK_START.md](QUICK_START.md)**

### Prerequisites

- Python 3.10+
- Node.js 16+

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
   - Copy `.env.example` to `.env`
   - Update with your Google OAuth credentials and settings

4. Run the server:
```bash
uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment (optional):
   - Create `.env` file if needed:
     ```
     REACT_APP_API_URL=http://localhost:8000
     ```

4. Run the development server:
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## Authentication

The system uses simple username/password authentication. Users can register with:
- Username (unique)
- Email (optional domain restriction)
- Full Name
- Password (minimum 6 characters)

Admin users are determined by email addresses listed in `ADMIN_EMAILS` environment variable.

## Initialize Database

The database is automatically created on first run. To add initial data (buildings and security points):

**Option 1: Use the initialization script (Recommended)**
```bash
cd backend
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
buildings = [
    Building(name="Main Building"),
    Building(name="Science Block"),
    Building(name="Library"),
]

for building in buildings:
    db.add(building)

db.commit()

# Add security points
security_points = [
    SecurityPoint(building_id=1, name="Main Entrance"),
    SecurityPoint(building_id=1, name="Reception"),
    SecurityPoint(building_id=2, name="Lab Security"),
    SecurityPoint(building_id=3, name="Library Front Desk"),
]

for point in security_points:
    db.add(point)

db.commit()
```

## Configuration

### Backend Environment Variables

- `DATABASE_URL`: Database connection string (default: SQLite)
- `ALLOWED_EMAIL_DOMAIN`: Campus email domain (e.g., `@campus.edu`) - leave empty to allow any email
- `ADMIN_EMAILS`: Comma-separated admin emails
- `JWT_SECRET`: Secret key for JWT tokens

### Frontend Environment Variables (Optional)

- `REACT_APP_API_URL`: Backend API URL (default: `http://localhost:8000`)
- `REACT_APP_ALLOWED_DOMAIN`: Display message about allowed email domain

## API Documentation

Once the backend is running:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Usage Flow

### Finder Flow

1. Login with Google (campus email)
2. Click "Report Found Item"
3. Fill in item details
4. Click on map to select location
5. Select building and security point
6. Enter hidden verification detail
7. Submit report
8. Drop item at selected security point

### Owner Flow

1. Login with Google
2. Browse "Found Items" list
3. Filter by category, building, or status
4. Click on item to view details
5. Click "Claim This Item"
6. Enter registration number, college details, and verification detail
7. Visit security point with details
8. Security verifies and releases item

### Admin Flow

1. Login as admin (email in ADMIN_EMAILS)
2. Access Admin Dashboard
3. View statistics
4. Manage items
5. Verify claims
6. Upload pickup photos for high-value items

## Map Features

- Folium-generated interactive map
- Red markers: Stored items
- Yellow markers: Claimed items
- Click markers to see item details
- Map updates automatically when items are claimed

## Notes

- This is a hackathon demo project
- SQLite is used by default for easy setup
- For production, use PostgreSQL
- Map coordinates default to a sample location (update in `backend/app/routes/map.py`)
- File uploads are stored in `backend/uploads/` directory

## License

This is a demonstration project for hackathon purposes.

