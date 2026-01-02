from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Optional, List
import os, shutil
from datetime import datetime

from .auth import router as auth_router
from .auth import get_current_user, get_current_admin
from . import ai_classifier

# ==========================
# IN-MEMORY ISSUE STORAGE
# ==========================
ISSUES: List[dict] = []

app = FastAPI(
    title="Civic Issue Tracker API",
    version="3.0.0"
)

# include auth routes
#app.include_router(auth_router)

# --------------------
# CORS
# --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# UPLOADS
# --------------------
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# --------------------
# PUBLIC ROUTES
# --------------------

@app.get("/")
def root():
    return {
        "message": "Civic Issue Tracker API",
        "docs": "/docs"
    }

@app.get("/health")
def health():
    return {
        "status": "ok",
        "time": datetime.utcnow().isoformat()
    }

# --------------------
# AUTH TEST ROUTE
# --------------------

@app.get("/protected")
def protected(user=Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role
    }

# --------------------
# ISSUE CREATION (CITIZEN)
# --------------------

@app.post("/issues")
def create_issue(
    title: str = Form(...),
    description: str = Form(...),
    issue_type: str = Form(...),
    image: Optional[UploadFile] = File(None),
    user=Depends(get_current_user)
):
    if len(title) < 3:
        raise HTTPException(status_code=400, detail="Title too short")

    image_path = None
    if image:
        ext = image.filename.split(".")[-1]
        filename = f"{user.id}_{int(datetime.utcnow().timestamp())}.{ext}"
        path = os.path.join(UPLOAD_DIR, filename)

        with open(path, "wb") as f:
            shutil.copyfileobj(image.file, f)

        image_path = f"/uploads/{filename}"

    issue = {
        "id": len(ISSUES) + 1,
        "title": title,
        "description": description,
        "type": issue_type,
        "image": image_path,
        "status": "OPEN",
        "reported_by": user.email,
        "created_at": datetime.utcnow().isoformat()
    }

    ISSUES.append(issue)

    return {
        "message": "Issue submitted successfully",
        "issue": issue
    }

# --------------------
# ADMIN: VIEW ALL ISSUES
# --------------------

@app.get("/admin/issues")
def get_all_issues(admin=Depends(get_current_admin)):
    return ISSUES

# --------------------
# AI CLASSIFICATION
# --------------------

@app.post("/ai/classify")
def classify(
    image: UploadFile = File(...),
    user=Depends(get_current_user)
):
    data = image.file.read()
    result = ai_classifier.classifier.predict_issue_type(data)

    return {
        "user": user.email,
        "prediction": result
    }

# --------------------
# ADMIN TEST ROUTE
# --------------------

@app.delete("/admin/secure-test")
def admin_only_test(admin=Depends(get_current_admin)):
    return {
        "message": "Admin access confirmed",
        "admin_email": admin.email
    }
