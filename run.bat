@echo off
REM ============================================================
REM  FitNexus - Startup Script (Windows)
REM  Prerequisites: Java 17+, Maven 3.9+, Node.js 18+
REM ============================================================

REM ---- NOTE: Remove or blank out credentials before pushing to GitHub ----
set DB_USERNAME=neondb_owner
set DB_PASSWORD=YOUR_NEON_PASSWORD_HERE

REM ---- Start Spring Boot Backend ----
echo [1/2] Starting Spring Boot backend (Neon PostgreSQL)...
start "FitNexus Backend" cmd /k "cd /d %~dp0fitnesstracker && mvn spring-boot:run"

REM Wait for backend to warm up
timeout /t 8 /nobreak >nul

REM ---- Start React Frontend ----
echo [2/2] Starting React frontend (Vite)...
start "FitNexus Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ============================================
echo  FitNexus is starting up!
echo  Backend  :  http://localhost:8080
echo  Frontend :  http://localhost:5173
echo  Swagger  :  http://localhost:8080/swagger-ui.html
echo ============================================
echo.
pause
