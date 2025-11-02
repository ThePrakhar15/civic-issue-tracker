@echo off
echo ========================================
echo 🚀 STARTING CIVIC ISSUE TRACKER
echo ========================================
echo.

echo 🌐 Starting Backend Server (Port 8000)...
cd backend
start cmd /k "python run.py"
timeout /t 3

echo.
echo ⚛️  Starting Frontend Server (Port 3000)...
cd ..\frontend
start cmd /k "npm start"
timeout /t 3

echo.
echo ✅ Both servers are starting...
echo.
echo 📍 Access Points:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo 🔑 Demo Logins:
echo    Administrator: admin@civicfix.com / admin123
echo    Citizen User: demo@citizen.com / demo123
echo.
echo ⚠️  Please wait for both servers to fully start...
echo    Backend takes ~10 seconds, Frontend takes ~30 seconds
echo.
pause