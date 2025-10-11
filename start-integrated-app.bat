@echo off
echo.
echo ========================================
echo   BrandMind AI - Integrated App Starter
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Checking installations...
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please install Python 3.8+ from python.org
    pause
    exit /b 1
)
echo ✓ Python installed

:: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js installed

echo.
echo [2/3] Checking dependencies...
echo.

:: Check if .env exists
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Please create .env with your API keys
    echo See env.template for reference
    echo.
)

:: Check frontend dependencies
cd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo ✓ Frontend dependencies installed
)
cd ..

echo.
echo [3/3] Starting servers...
echo.
echo This will open 2 terminal windows:
echo   1. Backend (Python/FastAPI) on http://localhost:8000
echo   2. Frontend (React/Vite) on http://localhost:5173
echo.
echo Press any key to start...
pause >nul

:: Start backend in new window
start "BrandMind AI - Backend" cmd /k "cd /d %~dp0backend && python main.py"

:: Wait a bit for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend in new window
start "BrandMind AI - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo   Servers Starting!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo The app will open in your browser shortly...
echo.
echo To stop: Close both terminal windows
echo.

:: Wait for frontend to be ready and open browser
timeout /t 8 /nobreak >nul
start http://localhost:5173

echo Browser opened!
echo.
echo Keep both terminal windows open while using the app.
echo.
pause

