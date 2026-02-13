# Quick Deployment Guide

## Fastest Way: Railway + Vercel (Free Tier)

### Backend (Railway) - 5 minutes

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repo
   - Railway auto-detects Python

3. **Add PostgreSQL:**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Copy the `DATABASE_URL` from Variables tab

4. **Set Environment Variables:**
   - Go to Variables tab, add:
   ```
   DATABASE_URL=<from Railway PostgreSQL>
   ALLOWED_EMAIL_DOMAIN=@campus.edu
   ADMIN_EMAILS=admin@campus.edu
   JWT_SECRET=<generate-random-string>
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. **Set Start Command:**
   - Settings → Deploy → Start Command:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

6. **Initialize Database:**
   - Click "Deploy Logs" → "Open Shell"
   - Run: `python init_db.py`

7. **Copy Backend URL:**
   - Get URL like: `https://your-app.railway.app`

---

### Frontend (Vercel) - 3 minutes

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```
   - Follow prompts
   - Set root directory: `frontend`

3. **Set Environment Variables:**
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   REACT_APP_ALLOWED_DOMAIN=@campus.edu
   ```

4. **Redeploy:**
   - Go to Deployments → Redeploy

5. **Copy Frontend URL:**
   - Get URL like: `https://your-app.vercel.app`

---

---

### Update Backend CORS

In Railway, add environment variable:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

Then redeploy backend.

---

## Alternative: Render + Netlify

### Backend (Render)

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add PostgreSQL database
6. Set environment variables

### Frontend (Netlify)

1. Go to [netlify.com](https://netlify.com)
2. Add site → Import from Git
3. Settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
4. Set environment variables

---

## One-Command Deploy (If using Vercel CLI)

```bash
# Backend (Railway via CLI - if available)
railway up

# Frontend
cd frontend && vercel --prod
```

---

## Verify Deployment

1. ✅ Backend accessible: `https://your-backend.railway.app/docs`
2. ✅ Frontend accessible: `https://your-frontend.vercel.app`
3. ✅ Can login with Google
4. ✅ Can report found item
5. ✅ Map displays correctly

---

## Troubleshooting

**CORS Errors:**
- Ensure `FRONTEND_URL` is set in backend
- Check URL matches exactly (https vs http)

**Database Errors:**
- Verify `DATABASE_URL` is correct
- Run `python init_db.py` in Railway shell

**Authentication:**
- Verify username/password are correct
- Check email domain restrictions if enabled

---

## Cost

**Free Tier:**
- Railway: $5/month credit (enough for demo)
- Vercel: Free for personal projects
- **Total: $0/month** ✅

