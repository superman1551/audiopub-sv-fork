@echo off
REM Script to reset MariaDB/MySQL root password on Windows
REM Run as Administrator (if needed for taskkill)

REM Set PATH to include MariaDB
set "PATH=C:\Program Files\MariaDB 12.0\bin;%PATH%"

echo Stopping any running mysqld process...
taskkill /f /im mysqld.exe > nul 2>&1
timeout /t 2 /nobreak > nul

echo Starting MariaDB in safe mode...
start /b mysqld --skip-grant-tables
timeout /t 5 /nobreak > nul

echo Connecting to reset password...
mysql -u root -e "FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123';"

echo Stopping safe mode...
taskkill /f /im mysqld.exe > nul 2>&1
timeout /t 2 /nobreak > nul

echo Starting MariaDB normally...
start /b mysqld
timeout /t 5 /nobreak > nul

echo Verifying connection with new password...
mysql -u root -proot123 -e "SELECT 'Password reset successful!' AS Status;"

echo Password reset to 'root123'. Update your .env file with DATABASE_PASSWORD=root123