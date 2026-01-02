# Helper script to install Maven on Windows
# This script will attempt to install Maven using Chocolatey or Scoop if available

Write-Host "=== Maven Installation Helper ===" -ForegroundColor Cyan
Write-Host ""

# Check for Chocolatey
$chocoCheck = Get-Command choco -ErrorAction SilentlyContinue
if ($chocoCheck) {
    Write-Host "Found Chocolatey! Attempting to install Maven..." -ForegroundColor Green
    Write-Host "You may be prompted for administrator privileges." -ForegroundColor Yellow
    Write-Host ""
    
    $response = Read-Host "Do you want to install Maven using Chocolatey? (Y/N)"
    if ($response -eq "Y" -or $response -eq "y") {
        try {
            choco install maven -y
            Write-Host "`nMaven installation completed!" -ForegroundColor Green
            Write-Host "Please restart PowerShell and run START_RMI_SERVER.ps1 again." -ForegroundColor Yellow
        } catch {
            Write-Host "`nError installing Maven: $_" -ForegroundColor Red
            Write-Host "You may need to run PowerShell as Administrator." -ForegroundColor Yellow
        }
        exit 0
    }
}

# Check for Scoop
$scoopCheck = Get-Command scoop -ErrorAction SilentlyContinue
if ($scoopCheck) {
    Write-Host "Found Scoop! Attempting to install Maven..." -ForegroundColor Green
    Write-Host ""
    
    $response = Read-Host "Do you want to install Maven using Scoop? (Y/N)"
    if ($response -eq "Y" -or $response -eq "y") {
        try {
            scoop install maven
            Write-Host "`nMaven installation completed!" -ForegroundColor Green
            Write-Host "Please restart PowerShell and run START_RMI_SERVER.ps1 again." -ForegroundColor Yellow
        } catch {
            Write-Host "`nError installing Maven: $_" -ForegroundColor Red
        }
        exit 0
    }
}

# If neither package manager is available
Write-Host "Chocolatey and Scoop were not found." -ForegroundColor Yellow
Write-Host ""
Write-Host "Manual Installation Instructions:" -ForegroundColor Cyan
Write-Host "1. Download Maven from: https://maven.apache.org/download.cgi" -ForegroundColor White
Write-Host "2. Extract the zip file to a folder (e.g., C:\Program Files\Apache\maven)" -ForegroundColor White
Write-Host "3. Add the 'bin' folder to your PATH:" -ForegroundColor White
Write-Host "   - Open System Properties > Environment Variables" -ForegroundColor White
Write-Host "   - Edit the 'Path' variable" -ForegroundColor White
Write-Host "   - Add: C:\Program Files\Apache\maven\bin" -ForegroundColor White
Write-Host "4. Restart PowerShell" -ForegroundColor White
Write-Host ""
Write-Host "Or install Chocolatey first from: https://chocolatey.org/install" -ForegroundColor Cyan
Write-Host "Then run this script again." -ForegroundColor Cyan

