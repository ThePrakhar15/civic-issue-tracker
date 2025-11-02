@echo off
echo ========================================
echo 🚀 CIVIC ISSUE TRACKER - ULTRA POLISHED
echo ========================================
echo.

echo 📁 Creating directory structure...
mkdir backend\app 2>nul
mkdir backend\uploads 2>nul
mkdir frontend\public 2>nul
mkdir frontend\src 2>nul
mkdir frontend\src\components 2>nul
mkdir frontend\src\pages 2>nul
mkdir frontend\src\hooks 2>nul
mkdir frontend\src\contexts 2>nul
mkdir frontend\src\utils 2>nul

echo.
echo 📦 Installing Backend Dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Backend dependencies installation failed!
    echo Please check if Python and pip are installed correctly.
    pause
    exit /b 1
)

echo.
echo 📦 Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependencies installation failed!
    echo Please check if Node.js is installed correctly.
    pause
    exit /b 1
)

echo.
echo ✅ All dependencies installed successfully!
echo.
echo 🎯 Next Steps:
echo   1. Run 'run.bat' to start both servers
echo   2. Or run manually:
echo      - Backend: cd backend && python run.py
echo      - Frontend: cd frontend && npm start
echo.
echo 🔑 Demo Accounts:
echo   Admin: admin@civicfix.com / admin123
echo   Citizen: demo@citizen.com / demo123
echo.
echo 📍 Access Points:
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
pause