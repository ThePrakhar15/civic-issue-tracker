# 🚀 Deployment Guide

## Quick Deployment Checklist

### Before Deploying:
- [ ] Update environment variables
- [ ] Change default admin password
- [ ] Configure CORS for production domain
- [ ] Set up database (PostgreSQL recommended)
- [ ] Configure file storage (S3/Cloudinary for images)
- [ ] Set up SSL/HTTPS
- [ ] Configure domain names

## Deployment Options

### Option 1: Vercel + Railway (Easiest)
1. **Frontend (Vercel)**
   - Connect GitHub repo
   - Root directory: `frontend`
   - Build command: `npm install && npm run build`
   - Output directory: `build`
   - Environment: `REACT_APP_API_URL=https://your-api.railway.app`

2. **Backend (Railway)**
   - Connect GitHub repo
   - Root directory: `backend`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables

### Option 2: Heroku
1. **Backend**
   ```bash
   cd backend
   heroku create civicfix-api
   heroku addons:create heroku-postgresql:hobby-dev
   git push heroku main
   ```

2. **Frontend**
   ```bash
   cd frontend
   heroku create civicfix-app --buildpack https://github.com/mars/create-react-app-buildpack
   git push heroku main
   ```

### Option 3: AWS/Azure/GCP
See detailed instructions in README.md

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-very-secure-secret-key-here
DATABASE_URL=postgresql://user:pass@host:5432/dbname
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://api.yourdomain.com
```

## Post-Deployment
- [ ] Test all features
- [ ] Monitor logs
- [ ] Set up error tracking (Sentry)
- [ ] Configure backups
- [ ] Set up monitoring (UptimeRobot)

