# PowerShell script to start RMI Server
# Run this script from the rmi-server directory

Write-Host "Building RMI Server..." -ForegroundColor Cyan
mvnd clean install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful! Starting RMI Server..." -ForegroundColor Green
    Write-Host "RMI Server will run on port 1099" -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    mvnd exec:java -Dexec.mainClass="com.distributed.rmi.server.RMIServer"
} else {
    Write-Host "Build failed! Please check errors above." -ForegroundColor Red
    exit 1
}

