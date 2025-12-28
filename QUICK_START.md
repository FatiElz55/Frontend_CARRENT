# Quick Start Commands (PowerShell)

## Start RMI Server (Run this FIRST!)

```powershell
cd C:\Users\elzfa\Desktop\Frontend_CARRENT\rmi-server
& "C:\Users\elzfa\Downloads\maven-mvnd-1.0.3-windows-amd64\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe" exec:java
```

Or double-click: `rmi-server\start-rmi.bat`

**Keep this window open!**

## Start Spring Boot API (Run this SECOND in a NEW terminal!)

```powershell
cd C:\Users\elzfa\Desktop\Frontend_CARRENT\spring-api
.\mvnw.cmd spring-boot:run
```

## Test API

Open browser: `http://localhost:8080/api/cars`

---

**Full Maven path if needed:**
`C:\Users\elzfa\Downloads\maven-mvnd-1.0.3-windows-amd64\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe`
