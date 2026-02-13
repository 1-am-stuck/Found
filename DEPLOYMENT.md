# Deployment Guide - Campus FOUND System

This guide covers deploying the Campus FOUND System to production.

## Table of Contents

1. [Backend Deployment](#backend-deployment)
2. [Frontend Deployment](#frontend-deployment)
3. [Database Setup](#database-setup)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Backend Deployment

### Option 1: Railway (Recommended for Hackathons)

**Railway** is easy to use and offers free tier.

1. **Create Railway Account:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder
   - Railway will auto-detect Python

3. **Configure Environment Variables:**
   - Go to Variables tab
   - Add all variables from `.env.example`
   - Set `DATABASE_URL` to Railway's PostgreSQL (auto-provisioned)

4. **Set Start Command:**
   - In Settings → Deploy, set start command:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

5. **Get Backend URL:**
   - Railway provides a URL like: `https://your-app.railway.app`

---

### Option 2: Render

1. **Create Render Account:**
   - Go to [render.com](https://render.com)
   - Sign up

2. **Create Web Service:**
   - Click "New" → "Web Service"
   - Connect GitHub repository
   - Set:
     - **Root Directory:** `backend`
     - **Environment:** Python 3
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Add PostgreSQL Database:**
   - Click "New" → "PostgreSQL"
   - Copy connection string to `DATABASE_URL`

4. **Set Environment Variables:**
   - Add all variables from `.env.example`

---

### Option 3: Heroku

1. **Install Heroku CLI:**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create App:**
   ```bash
   cd backend
   heroku create your-app-name
   ```

4. **Add PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. **Set Environment Variables:**
   ```bash
   heroku config:set GOOGLE_CLIENT_ID=your-client-id
   heroku config:set GOOGLE_CLIENT_SECRET=your-secret
   heroku config:set ALLOWED_EMAIL_DOMAIN=@campus.edu
   heroku config:set ADMIN_EMAILS=admin@campus.edu
   heroku config:set JWT_SECRET=your-secret-key
   ```

6. **Create Procfile:**
   Create `backend/Procfile`:
   ```
   web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

7. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

8. **Initialize Database:**
   ```bash
   heroku run python init_db.py
   ```

---

### Option 4: DigitalOcean App Platform

1. **Create App:**
   - Go to [DigitalOcean](https://www.digitalocean.com)
   - Create App → Connect GitHub

2. **Configure:**
   - **Type:** Web Service
   - **Source:** `backend` folder
   - **Build Command:** `pip install -r requirements.txt`
   - **Run Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Add Database:**
   - Add PostgreSQL component
   - Use connection string in `DATABASE_URL`

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure:**
   - Set root directory to `frontend`
   - Add environment variables:
     - `REACT_APP_GOOGLE_CLIENT_ID`
     - `REACT_APP_GOOGLE_CLIENT_SECRET`
     - `REACT_APP_API_URL` (your backend URL)

4. **Update API URL:**
   - In `frontend/src/api/api.js`, update:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
   ```

---

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   cd frontend
   netlify deploy --prod
   ```

3. **Configure via Dashboard:**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Add site → Connect GitHub
   - Set:
     - **Base directory:** `frontend`
     - **Build command:** `npm run build`
     - **Publish directory:** `frontend/build`

4. **Set Environment Variables:**
   - Site settings → Environment variables
   - Add `REACT_APP_GOOGLE_CLIENT_ID` and `REACT_APP_API_URL`

---

### Option 3: GitHub Pages

1. **Update package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/campus-found",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

2. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

---

## Database Setup

### PostgreSQL Setup (Production)

1. **Update Database URL:**
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

2. **Update SQLAlchemy for PostgreSQL:**
   The code already supports PostgreSQL. Just update the connection string.

3. **Run Migrations:**
   ```bash
   # On your deployment platform
   python init_db.py
   ```

### Using Railway PostgreSQL

Railway auto-provisions PostgreSQL. Just copy the `DATABASE_URL` from Railway dashboard.

### Using Render PostgreSQL

1. Create PostgreSQL database in Render
2. Copy internal connection string
3. Use it as `DATABASE_URL`

---

## Environment Variables

### Backend (.env)

```bash
DATABASE_URL=postgresql://user:pass@host:port/db
ALLOWED_EMAIL_DOMAIN=@campus.edu
ADMIN_EMAILS=admin@campus.edu,security@campus.edu
JWT_SECRET=generate-a-secure-random-string-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Generate JWT_SECRET:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Frontend (.env)

```bash
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_ALLOWED_DOMAIN=@campus.edu
```

---

## Update CORS Settings

After deploying backend, update CORS in `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend-domain.com",  # Add your frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database initialized with sample data
- [ ] Environment variables set correctly
- [ ] CORS configured for frontend domain
- [ ] Test login flow
- [ ] Test item reporting
- [ ] Test item claiming
- [ ] Test admin dashboard
- [ ] Map displays correctly
- [ ] File uploads work (if using)

---

## Quick Deploy Scripts

### Railway + Vercel (Fastest)

**Backend (Railway):**
1. Push code to GitHub
2. Connect Railway to repo
3. Set environment variables
4. Deploy

**Frontend (Vercel):**
1. `cd frontend && vercel`
2. Set environment variables
3. Update `API_BASE_URL` in code

---

## Troubleshooting

### Backend Issues

**Database Connection Error:**
- Check `DATABASE_URL` format
- Ensure database is accessible
- Check firewall rules

**CORS Errors:**
- Update `allow_origins` in `main.py`
- Include exact frontend URL (with https)

**Port Issues:**
- Use `$PORT` environment variable
- Railway/Render auto-assigns port

### Frontend Issues

**API Connection Failed:**
- Check `REACT_APP_API_URL` is set
- Verify backend URL is correct
- Check CORS settings

**Google OAuth Not Working:**
- Verify redirect URIs match exactly
- Check client ID is correct
- Ensure domain is authorized

---

## Cost Estimates

**Free Tier Options:**
- **Railway:** $5/month free credit (enough for demo)
- **Render:** Free tier available
- **Vercel:** Free for personal projects
- **Netlify:** Free tier available

**Paid Options:**
- **Heroku:** $7/month (hobby dyno)
- **DigitalOcean:** $5/month (basic droplet)

---

## Production Considerations

1. **Use PostgreSQL** instead of SQLite
2. **Set strong JWT_SECRET**
3. **Enable HTTPS** (most platforms do this automatically)
4. **Set up monitoring** (optional)
5. **Configure backups** for database
6. **Rate limiting** (add if needed)
7. **Error logging** (add Sentry or similar)

---

## Support

For deployment issues:
1. Check platform-specific logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for frontend errors

