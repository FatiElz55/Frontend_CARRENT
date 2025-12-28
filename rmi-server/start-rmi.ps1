# Quick start script for RMI Server
$mvndPath = "C:\Users\elzfa\Downloads\maven-mvnd-1.0.3-windows-amd64\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe"

Write-Host "Starting RMI Server..." -ForegroundColor Cyan
& $mvndPath exec:java -Dexec.mainClass="com.distributed.rmi.server.RMIServer"

