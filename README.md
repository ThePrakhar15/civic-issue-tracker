# 🚀 Ultra Polished Civic Issue Tracker

A modern, production-ready, community-powered platform for reporting and tracking civic issues with beautiful UI and advanced features.

## ✨ Features

- 🎨 **Ultra Modern UI** - Gradient designs, smooth animations, responsive layout
- 🔐 **JWT Authentication** - Secure login for citizens and admins
- 🗺️ **Interactive Maps** - Cluster-based issue visualization with Leaflet
- 🤖 **AI Classification** - Automatic issue type detection from images (mock implementation)
- 📱 **Fully Responsive** - Works perfectly on all devices
- 📊 **Admin Dashboard** - Comprehensive issue management with filtering
- 🔔 **Toast Notifications** - Beautiful alert system
- 📸 **Image Upload** - Support for issue photos with preview
- 🛡️ **Error Boundaries** - Graceful error handling
- ✅ **Form Validation** - Client and server-side validation

## 🛠 Tech Stack

### Backend
- **FastAPI** - Modern, fast Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Lightweight database (easily replaceable with PostgreSQL)
- **JWT** - Secure authentication
- **bcrypt** - Password hashing
- **Pillow** - Image processing

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Leaflet** - Interactive maps
- **React Leaflet** - React wrapper for Leaflet

## 📋 Prerequisites

- Python 3.8+
- Node.js 14+ and npm
- pip (Python package manager)

## 🎯 Quick Start

### One-Click Setup (Windows)

1. **Run Setup Script** (First time only):
   ```bash
   setup.bat
   ```

2. **Start the Application**:
   ```bash
   run.bat
   ```

This will automatically:
- Install all backend and frontend dependencies
- Start the backend server on port 8000
- Start the frontend development server on port 3000

### Manual Setup

#### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python run.py
```

The backend will start on `http://localhost:8000`

#### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

## 🔑 Demo Accounts

Pre-configured accounts for testing:

- **Administrator**: 
  - Email: `admin@civicfix.com`
  - Password: `admin123`

- **Citizen User**: 
  - Email: `demo@citizen.com`
  - Password: `demo123`

## 📍 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Interactive Swagger UI)
- **Alternative API Docs**: http://localhost:8000/redoc

## 🎨 Project Structure

```
civic-issue-tracker/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application
│   │   ├── models.py        # Database models
│   │   ├── database.py      # Database configuration
│   │   ├── auth.py          # Authentication logic
│   │   └── ai_classifier.py # AI classification (mock)
│   ├── uploads/             # Uploaded issue images
│   ├── civicfix.db          # SQLite database
│   ├── requirements.txt     # Python dependencies
│   └── run.py               # Backend entry point
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   └── App.js           # Main app component
│   ├── public/
│   ├── package.json         # Node dependencies
│   └── README.md
├── setup.bat                 # Windows setup script
├── run.bat                   # Windows run script
└── README.md                 # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login user
- `GET /auth/verify` - Verify JWT token

### Issues
- `GET /issues` - List all issues (with optional filters)
- `GET /users/me/issues` - Get current user's issues
- `POST /issues` - Create new issue (requires auth)
- `PATCH /issues/{id}/resolve` - Resolve issue (admin only)
- `DELETE /issues/{id}` - Delete issue (admin only)

### AI Classification
- `POST /ai/classify` - Classify issue from image (mock)

## 🚀 Production Deployment

### Backend Deployment

1. **Environment Variables**:
   Create a `.env` file or set environment variables:
   ```bash
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=sqlite:///./civicfix.db  # or PostgreSQL URL
   ```

2. **Using Gunicorn** (recommended for production):
   ```bash
   pip install gunicorn
   gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

3. **Using Docker**:
   ```dockerfile
   FROM python:3.9-slim
   WORKDIR /app
   COPY backend/requirements.txt .
   RUN pip install -r requirements.txt
   COPY backend/ .
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

### Frontend Deployment

1. **Build for Production**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve with Nginx**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /path/to/frontend/build;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **Using Vercel/Netlify**:
   - Connect your repository
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/build`

### Environment Configuration

Create `frontend/.env.production`:
```env
REACT_APP_API_URL=https://api.yourdomain.com
```

## 🔒 Security Best Practices

1. **Change Default Credentials**: Update admin password in production
2. **Use Environment Variables**: Never commit secrets to version control
3. **Enable HTTPS**: Use SSL/TLS in production
4. **Rate Limiting**: Add rate limiting to API endpoints
5. **CORS Configuration**: Update CORS origins for production
6. **Database**: Consider migrating to PostgreSQL for production
7. **File Upload**: Add additional validation and scanning for uploaded images

## 🧪 Testing

### Manual Testing
1. Register a new account
2. Login with demo credentials
3. Report an issue with image
4. View issues on map
5. Admin: Access dashboard and manage issues

### Automated Testing (To be implemented)
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📝 Development Notes

- The AI classifier is currently a mock implementation. Replace with actual ML model for production.
- Database uses SQLite by default. Consider PostgreSQL for production.
- Image uploads are stored locally. Consider cloud storage (S3, Cloudinary) for production.
- CORS is configured for localhost. Update for production domains.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues and questions:
- Check the API documentation at `/docs`
- Review error messages in browser console
- Check backend logs for detailed errors

## 🎯 Future Enhancements

- [ ] Real ML-based image classification
- [ ] Email notifications for issue updates
- [ ] SMS alerts for critical issues
- [ ] Mobile app (React Native)
- [ ] Real-time updates with WebSockets
- [ ] Issue comments and discussions
- [ ] Voting system for issue priority
- [ ] Integration with municipal systems
- [ ] Analytics dashboard
- [ ] Export reports to PDF

## 🙏 Acknowledgments

Built with love for better civic engagement and community improvement.

---

**Made with ❤️ for better communities**
# cicvi-issue-tracker
