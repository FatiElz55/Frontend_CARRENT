# Installing Maven on Windows

## Quick Installation Steps:

### Option 1: Using Chocolatey (Recommended - if you have it)
```powershell
choco install maven
```

### Option 2: Manual Installation

1. **Download Maven:**
   - Go to: https://maven.apache.org/download.cgi
   - Download: `apache-maven-3.9.x-bin.zip` (latest version)

2. **Extract:**
   - Extract to: `C:\Program Files\Apache\maven`
   - You should have: `C:\Program Files\Apache\maven\apache-maven-3.9.x`

3. **Add to PATH:**
   - Open System Properties → Environment Variables
   - Under "System variables", find `Path` and click "Edit"
   - Click "New" and add: `C:\Program Files\Apache\maven\apache-maven-3.9.x\bin`
   - Click OK on all dialogs

4. **Verify:**
   - Open a NEW PowerShell window
   - Run: `mvn --version`
   - You should see Maven version information

### Option 3: Use IDE (Easiest for Development)

**IntelliJ IDEA or Eclipse:**
- Open the `rmi-server` folder as a project
- The IDE will automatically detect `pom.xml` and use Maven
- Right-click on `RMIServer.java` → Run
- For Spring Boot, open `spring-api` folder → Run `SpringApiApplication.java`

## Alternative: Use Spring Boot's Maven Wrapper

Since Spring Boot has `mvnw`, you could:
1. Use IDE for RMI server (no Maven wrapper needed)
2. Use `./mvnw` or `mvnw.cmd` for Spring Boot

## Quick Test After Installation

After installing Maven, open a NEW PowerShell window and run:
```powershell
mvn --version
```

If it shows version info, Maven is ready!

