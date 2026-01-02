# PowerShell script to start Spring API Server
# Run this script from the spring-api directory

$ErrorActionPreference = "Stop"

function Find-Maven {
    # First, check for Maven Wrapper (preferred)
    $mvnwPath = Join-Path $PSScriptRoot "mvnw.cmd"
    if (Test-Path $mvnwPath) {
        Write-Host "Found Maven Wrapper: $mvnwPath" -ForegroundColor Green
        return $mvnwPath
    }
    
    # Check if Maven is in PATH
    $mvnInPath = Get-Command mvn -ErrorAction SilentlyContinue
    if ($mvnInPath) {
        Write-Host "Found Maven in PATH: $($mvnInPath.Source)" -ForegroundColor Green
        return "mvn"
    }
    
    # Check for mvnd (Maven Daemon) in PATH
    $mvndInPath = Get-Command mvnd -ErrorAction SilentlyContinue
    if ($mvndInPath) {
        Write-Host "Found Maven Daemon in PATH: $($mvndInPath.Source)" -ForegroundColor Green
        return "mvnd"
    }
    
    # Check XAMPP installation (common location)
    $xamppMvndPath = "C:\xampp\apache\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe"
    if (Test-Path $xamppMvndPath) {
        Write-Host "Found Maven Daemon in XAMPP: $xamppMvndPath" -ForegroundColor Green
        return $xamppMvndPath
    }
    
    # Check common installation locations
    $commonPaths = @(
        "$env:ProgramFiles\Apache\maven\bin\mvn.cmd",
        "$env:ProgramFiles(x86)\Apache\maven\bin\mvn.cmd",
        "$env:LOCALAPPDATA\Programs\Apache Maven\bin\mvn.cmd"
    )
    
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            Write-Host "Found Maven at: $path" -ForegroundColor Green
            return $path
        }
    }
    
    return $null
}

function Install-MavenInstructions {
    Write-Host "`n=== Maven Installation Required ===" -ForegroundColor Yellow
    Write-Host "`nMaven is not installed or not in your PATH." -ForegroundColor Red
    Write-Host "`nPlease choose one of the following options:`n" -ForegroundColor Cyan
    
    Write-Host "Option 1: Use Maven Wrapper (Recommended)" -ForegroundColor Green
    Write-Host "  .\mvnw.cmd spring-boot:run" -ForegroundColor White
    Write-Host "  (The mvnw.cmd file should be in this directory)" -ForegroundColor Gray
    
    Write-Host "`nOption 2: Install via Chocolatey (if you have Chocolatey)" -ForegroundColor Green
    Write-Host "  choco install maven" -ForegroundColor White
    
    Write-Host "`nOption 3: Install via Scoop (if you have Scoop)" -ForegroundColor Green
    Write-Host "  scoop install maven" -ForegroundColor White
    
    Write-Host "`nOption 4: Manual Installation" -ForegroundColor Green
    Write-Host "  1. Download Maven from: https://maven.apache.org/download.cgi" -ForegroundColor White
    Write-Host "  2. Extract to a folder (e.g., C:\Program Files\Apache\maven)" -ForegroundColor White
    Write-Host "  3. Add Maven\bin to your PATH environment variable" -ForegroundColor White
    Write-Host "  4. Restart PowerShell and try again" -ForegroundColor White
    
    Write-Host "`nOption 5: Use an IDE" -ForegroundColor Green
    Write-Host "  Use IntelliJ IDEA, Eclipse, or VS Code with Java extensions to run the project" -ForegroundColor White
    
    Write-Host "`n=== End Installation Instructions ===`n" -ForegroundColor Yellow
}

# Check for Java first
$javaCheck = Get-Command java -ErrorAction SilentlyContinue
if (-not $javaCheck) {
    Write-Host "ERROR: Java is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Java 17 or higher and add it to your PATH." -ForegroundColor Yellow
    exit 1
}

Write-Host "Java found: $($javaCheck.Source)" -ForegroundColor Green
Write-Host "Java version:" -ForegroundColor Cyan
java -version

Write-Host "`nChecking for Maven..." -ForegroundColor Cyan
$mavenCmd = Find-Maven

if (-not $mavenCmd) {
    Install-MavenInstructions
    exit 1
}

Write-Host "`nStarting Spring API Server..." -ForegroundColor Cyan
Write-Host "The server will run on port 8080" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

try {
    # Run the Spring Boot application
    $mavenArgs = @("spring-boot:run")
    & $mavenCmd $mavenArgs
} catch {
    Write-Host "`nError executing Maven: $_" -ForegroundColor Red
    exit 1
}

