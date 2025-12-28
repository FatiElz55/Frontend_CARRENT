@echo off
echo Compiling RMI Server...
echo.

REM Check if Java is available
where java >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Java is not in PATH. Please install Java 21 or add it to PATH.
    pause
    exit /b 1
)

REM Check for Maven
where mvn >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Maven is not installed or not in PATH.
    echo.
    echo Please either:
    echo 1. Install Maven from https://maven.apache.org/download.cgi
    echo 2. Add Maven bin directory to your PATH
    echo 3. Use an IDE (IntelliJ IDEA, Eclipse) to compile and run
    echo.
    pause
    exit /b 1
)

echo Maven found. Building project...
call mvn clean compile exec:java -Dexec.mainClass="com.distributed.rmi.server.RMIServer"

pause

