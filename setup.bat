@echo off
echo ========================================
echo AI Campaign Generator - Setup Script
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo [ERROR] .env file not found!
    echo.
    echo Please create .env file with your API keys:
    echo 1. Copy .env.example to .env
    echo 2. Add your API keys from:
    echo    - Google AI Studio: https://aistudio.google.com/app/apikey
    echo    - Hugging Face: https://huggingface.co/settings/tokens
    echo    - Tavily: https://tavily.com
    echo.
    pause
    exit /b 1
)

echo [1/3] Setting up Python backend...
cd backend

REM Check if venv exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing Python dependencies...
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo [2/3] Setting up React frontend...
cd frontend

echo Installing Node dependencies...
call npm install

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Node dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo [3/3] Creating storage directories...
if not exist storage mkdir storage
if not exist storage\assets mkdir storage\assets
if not exist storage\campaigns mkdir storage\campaigns

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To run the application:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   venv\Scripts\activate
echo   python main.py
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
pause
