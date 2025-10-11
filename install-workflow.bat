@echo off
echo ================================================
echo   BrandMind AI - Workflow Builder Installation
echo ================================================
echo.
echo This will install the new workflow builder
echo dependencies for the frontend.
echo.
pause

cd frontend

echo.
echo [1/3] Installing dependencies...
echo.
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Installation failed!
    echo.
    echo Trying to fix...
    echo.
    del package-lock.json
    rmdir /s /q node_modules
    call npm install
)

echo.
echo [2/3] Verifying installation...
echo.
call npm list reactflow zustand

echo.
echo [3/3] Installation complete!
echo.
echo ================================================
echo   🎉 Workflow Builder is ready!
echo ================================================
echo.
echo To start the application:
echo   1. Run: npm run dev
echo   2. Open: http://localhost:5173
echo   3. Click "Workflow Builder" button
echo.
echo For detailed guide, see:
echo   WORKFLOW_BUILDER_GUIDE.md
echo.
pause

