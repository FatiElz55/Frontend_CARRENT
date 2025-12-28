@echo off
echo Starting RMI Server...
cd /d "%~dp0"
"C:\Users\elzfa\Downloads\maven-mvnd-1.0.3-windows-amd64\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe" exec:java
pause
