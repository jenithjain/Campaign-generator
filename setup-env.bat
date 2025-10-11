@echo off
echo ========================================
echo   Campaign Generator - API Keys Setup
echo ========================================
echo.

REM Check if .env already exists
if exist .env (
    echo [!] .env file already exists!
    echo.
    choice /C YN /M "Do you want to overwrite it? (This will delete your existing keys)"
    if errorlevel 2 goto :cancel
    if errorlevel 1 goto :create
) else (
    goto :create
)

:create
echo [*] Creating .env file from template...
copy env.template .env > nul

if exist .env (
    echo [✓] .env file created successfully!
    echo.
    echo ========================================
    echo   NEXT STEPS:
    echo ========================================
    echo.
    echo 1. Open the .env file in a text editor
    echo 2. Get your API keys from:
    echo.
    echo    Google AI Studio (Gemini):
    echo    https://aistudio.google.com/app/apikey
    echo.
    echo    Hugging Face:
    echo    https://huggingface.co/settings/tokens
    echo.
    echo    Tavily:
    echo    https://tavily.com
    echo.
    echo 3. Replace the placeholder values with your actual keys
    echo 4. Save the .env file
    echo 5. Restart the backend server
    echo.
    echo ========================================
    echo.
    echo For detailed instructions, see:
    echo CONFIGURE_API_KEYS.md
    echo.
    echo Opening .env file now...
    timeout /t 2 > nul
    notepad .env
) else (
    echo [✗] Failed to create .env file
    echo.
    echo Please manually copy env.template to .env
)

goto :end

:cancel
echo.
echo [!] Setup cancelled. Your existing .env file was not modified.
goto :end

:end
echo.
pause

