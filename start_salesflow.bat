@echo off
title SalesFlow CRM - Cloud-Based SaaS CRM System
color 0B
echo ============================================================
echo   Starting SalesFlow CRM Web Application...
echo   Project: Cloud-Based SaaS Customer Relationship Management
echo   Architecture: Full-Stack React + REST API + MySQL/PostgreSQL
echo ============================================================
echo.

:: Launch python server in background or current window
start "" "http://localhost:5000"
python server.py 5000
pause

