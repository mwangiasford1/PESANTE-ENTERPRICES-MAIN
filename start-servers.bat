@echo off
echo 🚀 Starting Pesante Enterprise Servers...
echo.

echo 📦 Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd backend && npm start"

echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo 🌐 Starting Frontend Server (Port 5173)...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Both servers are starting...
echo 📱 Backend: http://localhost:5000
echo 🌐 Frontend: http://localhost:5173
echo.
echo Press any key to exit this launcher...
pause > nul 