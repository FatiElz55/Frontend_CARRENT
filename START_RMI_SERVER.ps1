# PowerShell script to start RMI Server
# Run this from the project root directory

Write-Host "Starting RMI Server for Car Rental System..." -ForegroundColor Cyan
Write-Host ""

# Navigate to rmi-server directory
Set-Location -Path "rmi-server"

# Build the project
Write-Host "Building RMI Server..." -ForegroundColor Cyan
mvnd clean install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful! Starting RMI Server..." -ForegroundColor Green
    Write-Host "RMI Server will run on port 1099" -ForegroundColor Yellow
    Write-Host "Service name: CarRentalService" -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    # Start the RMI server
    mvnd exec:java -Dexec.mainClass="com.distributed.rmi.server.RMIServer"
} else {
    Write-Host "Build failed! Please check errors above." -ForegroundColor Red
    exit 1
}

