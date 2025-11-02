from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from datetime import datetime

# Import from current package using relative imports
from . import models, auth, ai_classifier
from .database import engine, get_db, init_db

app = FastAPI(
    title="Civic Issue Reporting System", 
    version="2.0.0",
    description="Ultra Polished Community Issue Tracking Platform"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize database
@app.on_event("startup")
def on_startup():
    init_db()
    # Create admin user
    db = next(get_db())
    try:
        admin_user = db.query(models.User).filter(models.User.email == "admin@civicfix.com").first()
        if not admin_user:
            admin_user = models.User(
                name="Administrator",
                email="admin@civicfix.com",
                password=auth.get_password_hash("admin123"),
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            print("🎯 Admin user created: admin@civicfix.com / admin123")
        
        # Create demo citizen user
        demo_user = db.query(models.User).filter(models.User.email == "demo@citizen.com").first()
        if not demo_user:
            demo_user = models.User(
                name="Demo Citizen",
                email="demo@citizen.com",
                password=auth.get_password_hash("demo123"),
                role="citizen"
            )
            db.add(demo_user)
            db.commit()
            print("👤 Demo citizen created: demo@citizen.com / demo123")
            
    except Exception as e:
        print(f"❌ Error creating users: {e}")
    finally:
        db.close()

# Auth routes
@app.post("/auth/signup")
def signup(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form("citizen"),
    db: Session = Depends(get_db)
):
    try:
        # Validate input
        if not name or len(name.strip()) < 2:
            raise HTTPException(status_code=400, detail="Name must be at least 2 characters long")
        
        if not email or "@" not in email:
            raise HTTPException(status_code=400, detail="Invalid email address")
        
        if not password or len(password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")
        
        # Validate role
        if role not in ["citizen", "admin"]:
            raise HTTPException(status_code=400, detail="Invalid role. Must be 'citizen' or 'admin'")
        
        # Check if user already exists
        existing_user = db.query(models.User).filter(models.User.email == email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_password = auth.get_password_hash(password)
        
        # Create user
        user = models.User(
            name=name.strip(),
            email=email.strip().lower(),
            password=hashed_password,
            role=role.lower()
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return {"message": "User created successfully", "user_id": user.id, "role": user.role}
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"❌ Signup error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create account: {str(e)}")

@app.post("/auth/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not auth.verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }

@app.get("/auth/verify")
def verify_token(current_user: models.User = Depends(auth.get_current_user)):
    return {
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": current_user.role
        }
    }

# Issue routes
@app.get("/issues", response_model=List[dict])
def get_issues(
    skip: int = 0,
    limit: int = 100,
    issue_type: Optional[str] = None,
    status: Optional[str] = None,
    admin_only: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Issue)
    
    # If admin_only parameter is set to "true", filter to show only citizen-reported issues
    # This ensures admin portal only shows issues reported by citizens
    if admin_only and admin_only.lower() == "true":
        query = query.join(models.User).filter(models.User.role == "citizen")
    
    if issue_type:
        query = query.filter(models.Issue.issue_type == issue_type)
    if status:
        query = query.filter(models.Issue.status == status)
    
    issues = query.order_by(models.Issue.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        {
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "issue_type": issue.issue_type,
            "image": issue.image,
            "latitude": issue.latitude,
            "longitude": issue.longitude,
            "status": issue.status,
            "priority": issue.priority,
            "created_at": issue.created_at.isoformat(),
            "user": {
                "id": issue.user.id,
                "name": issue.user.name,
                "email": issue.user.email,
                "role": issue.user.role
            }
        }
        for issue in issues
    ]

@app.get("/users/me/issues")
def get_my_issues(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    issues = db.query(models.Issue).filter(models.Issue.user_id == current_user.id).order_by(models.Issue.created_at.desc()).all()
    
    return [
        {
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "issue_type": issue.issue_type,
            "image": issue.image,
            "latitude": issue.latitude,
            "longitude": issue.longitude,
            "status": issue.status,
            "priority": issue.priority,
            "created_at": issue.created_at.isoformat()
        }
        for issue in issues
    ]

@app.post("/issues")
def create_issue(
    title: str = Form(...),
    description: str = Form(...),
    issue_type: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    image: Optional[UploadFile] = File(None),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Validate inputs
    if not title or len(title.strip()) < 3:
        raise HTTPException(status_code=400, detail="Title must be at least 3 characters long")
    if not description or len(description.strip()) < 10:
        raise HTTPException(status_code=400, detail="Description must be at least 10 characters long")
    if issue_type not in ['pothole', 'garbage', 'streetlight', 'other']:
        raise HTTPException(status_code=400, detail="Invalid issue type")
    if not (-90 <= latitude <= 90):
        raise HTTPException(status_code=400, detail="Invalid latitude. Must be between -90 and 90")
    if not (-180 <= longitude <= 180):
        raise HTTPException(status_code=400, detail="Invalid longitude. Must be between -180 and 180")
    
    image_path = None
    if image and image.filename:
        # Validate file type
        allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
        file_extension = image.filename.split('.')[-1].lower()
        if file_extension not in allowed_extensions:
            raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}")
        
        # Validate file size (max 5MB)
        image.file.seek(0, 2)  # Seek to end
        file_size = image.file.tell()
        image.file.seek(0)  # Reset to beginning
        if file_size > 5 * 1024 * 1024:  # 5MB
            raise HTTPException(status_code=400, detail="File size exceeds 5MB limit")
        
        filename = f"{current_user.id}_{int(datetime.utcnow().timestamp())}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        image_path = f"/uploads/{filename}"
    
    priority_map = {
        "pothole": "high",
        "garbage": "medium",
        "streetlight": "medium",
        "other": "low"
    }
    priority = priority_map.get(issue_type, "low")
    
    issue = models.Issue(
        user_id=current_user.id,
        title=title,
        description=description,
        issue_type=issue_type,
        image=image_path,
        latitude=latitude,
        longitude=longitude,
        priority=priority
    )
    
    db.add(issue)
    db.commit()
    db.refresh(issue)
    
    return {"message": "Issue reported successfully", "issue_id": issue.id}

@app.post("/ai/classify")
def ai_classify_issue(
    image: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user)
):
    image_data = image.file.read()
    prediction = ai_classifier.classifier.predict_issue_type(image_data)
    
    return {
        "predicted_type": prediction['issue_type'],
        "confidence": prediction['confidence'],
        "all_predictions": prediction.get('all_predictions', {})
    }

@app.patch("/issues/{issue_id}/status")
def update_issue_status(
    issue_id: int,
    status: str = Form(...),
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    if status not in ['open', 'in_progress', 'resolved', 'rejected']:
        raise HTTPException(status_code=400, detail="Invalid status. Must be: open, in_progress, resolved, or rejected")
    
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    issue.status = status
    db.commit()
    
    return {"message": f"Issue status updated to {status}", "status": status}

@app.patch("/issues/{issue_id}/resolve")
def resolve_issue(
    issue_id: int,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    issue.status = "resolved"
    db.commit()
    
    return {"message": "Issue marked as resolved"}

@app.delete("/issues/{issue_id}")
def delete_issue(
    issue_id: int,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    if issue.image and os.path.exists(issue.image.lstrip('/')):
        try:
            os.remove(issue.image.lstrip('/'))
        except:
            pass  # Ignore file deletion errors
    
    db.delete(issue)
    db.commit()
    
    return {"message": "Issue deleted successfully"}

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {
        "message": "🚀 Ultra Polished Civic Issue Reporting System API", 
        "version": "2.0.0",
        "docs": "/docs",
        "admin_login": "admin@civicfix.com / admin123",
        "demo_login": "demo@citizen.com / demo123"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}