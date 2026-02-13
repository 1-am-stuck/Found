# Quick Start Guide

Follow these steps to run the Campus FOUND System locally.

## Prerequisites

- **Python 3.10+** installed
- **Node.js 16+** and npm installed
- **Git** (optional, if cloning from repository)

## Step 1: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended):**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment file:**
   - Create a file named `.env` in the `backend` directory
   - Copy this content:
   ```
   DATABASE_URL=sqlite:///./campus_found.db
   ALLOWED_EMAIL_DOMAIN=@campus.edu
   ADMIN_EMAILS=admin@campus.edu
   JWT_SECRET=your-secret-key-change-this-in-production
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```
   - **Note:** Generate a secure JWT_SECRET with:
     ```bash
     python -c "import secrets; print(secrets.token_urlsafe(32))"
     ```

5. **Initialize database:**
   ```bash
   python init_db.py
   ```
   This creates sample buildings and security points.

6. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload
   ```
   
   You should see:
   ```
   INFO:     Uvicorn running on http://127.0.0.1:8000
   INFO:     Application startup complete.
   ```

7. **Verify backend is running:**
   - Open browser: http://localhost:8000/docs
   - You should see the API documentation (Swagger UI)

## Step 2: Frontend Setup

1. **Open a new terminal window** (keep backend running)

2. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   This may take a few minutes.

4. **Create environment file (optional):**
   - Create a file named `.env` in the `frontend` directory
   - Add (if backend is on different URL):
   ```
   REACT_APP_API_URL=http://localhost:8000
   REACT_APP_ALLOWED_DOMAIN=@campus.edu
   ```

5. **Start the frontend server:**
   ```bash
   npm start
   ```
   
   The browser should automatically open to http://localhost:3000
   - If it doesn't, manually open http://localhost:3000

## Step 3: Use the Application

1. **Register a new account:**
   - On the login page, click "Register here"
   - Fill in:
     - Full Name
     - Email (must end with `@campus.edu` if domain restriction is enabled)
     - Username
     - Password (minimum 6 characters)
   - Click "Register"

2. **Login:**
   - Enter your username and password
   - Click "Sign In"

3. **Test the features:**
   - **Home:** View the map with found items
   - **Report Found:** Click "Report Found" to add a new item
   - **Found Items:** Browse the list of found items
   - **Admin Dashboard:** If your email is in ADMIN_EMAILS, you'll have admin access

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Use a different port
uvicorn app.main:app --reload --port 8001
```
Then update frontend `.env` with `REACT_APP_API_URL=http://localhost:8001`

**Module not found errors:**
- Make sure virtual environment is activated
- Reinstall: `pip install -r requirements.txt`

**Database errors:**
- Delete `campus_found.db` and run `python init_db.py` again

### Frontend Issues

**Port 3000 already in use:**
- The app will ask to use port 3001 instead
- Or manually set: `PORT=3001 npm start`

**npm install fails:**
- Try: `npm install --legacy-peer-deps`
- Or: `npm cache clean --force` then `npm install`

**Can't connect to backend:**
- Check backend is running on http://localhost:8000
- Check CORS settings in `backend/app/main.py`
- Check `REACT_APP_API_URL` in frontend `.env`

### Authentication Issues

**Email domain error:**
- Check `ALLOWED_EMAIL_DOMAIN` in backend `.env`
- Set to empty string `""` to allow any email
- Or use an email ending with the specified domain

**Admin access:**
- Add your email to `ADMIN_EMAILS` in backend `.env`
- Restart backend server
- Re-register or update your user in database

## Quick Commands Reference

### Backend
```bash
cd backend
python -m venv venv
# Activate venv (see above)
pip install -r requirements.txt
python init_db.py
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## What's Running Where

- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Frontend App:** http://localhost:3000

## Next Steps

- Read the main [README.md](README.md) for more details
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Explore the API at http://localhost:8000/docs

