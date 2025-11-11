@echo off
echo ===================================
echo AudioPub Development Server Startup
echo ===================================
echo.

REM Navigate to project directory
cd /d "%~dp0"

REM Set PATH to include Node.js and MariaDB
set "PATH=C:\Program Files\nodejs;C:\Program Files\MariaDB 12.0\bin;%PATH%"

REM Disable email in local dev unless explicitly enabled
set NO_EMAIL=true

REM Check if MariaDB is running
echo [1/4] Checking MariaDB...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo MariaDB not running. Starting...
    start "MariaDB" /B "C:\Program Files\MariaDB 12.0\bin\mysqld.exe"
    timeout /t 5 /nobreak >nul
    echo MariaDB started.
) else (
    echo MariaDB already running.
)

REM Create database
echo.
echo [2/4] Creating database...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS audiopub;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Database ready.
) else (
    echo Warning: Could not create database. It may already exist.
)

REM Run migrations
echo.
echo [3/4] Running database migrations...
call npm run db:migrate
if %ERRORLEVEL% NEQ 0 (
    echo Error running migrations!
    pause
    exit /b 1
)

REM Check ffmpeg availability (non-blocking)
echo.
echo [Info] Checking for ffmpeg in PATH...
where ffmpeg >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [Warning] ffmpeg not found in PATH. Audio transcoding will fail until it's installed.
)

REM Start dev server
echo.
echo [4/4] Starting development server...
echo.
echo ===================================
echo Server will be available at:
echo http://localhost:5173
echo ===================================
echo.
echo Press Ctrl+C to stop the server
echo.
npm run dev

pause
