# Quick Reference Card - Presentation Day

## ⚡ Fast Startup (Copy-Paste Commands)

### Terminal 1 - RMI Server
```powershell
cd C:\Users\elzfa\Desktop\Frontend_CARRENT\rmi-server
.\start-rmi.bat
```
✅ Wait for: "RMI Server is running..."

---

### Terminal 2 - Spring Boot
```powershell
cd C:\Users\elzfa\Desktop\Frontend_CARRENT\spring-api
& "C:\Users\elzfa\Downloads\maven-mvnd-1.0.3-windows-amd64\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe" spring-boot:run
```
✅ Wait for: "Started SpringApiApplication"

---

### Terminal 3 - Frontend
```powershell
cd C:\Users\elzfa\Desktop\Frontend_CARRENT
npm run dev
```
✅ Wait for: "Local: http://localhost:5173/"

---

## 📋 Startup Checklist

- [ ] MySQL running in XAMPP (port 3306)
- [ ] Terminal 1: RMI Server running (port 1099)
- [ ] Terminal 2: Spring Boot running (port 8080)
- [ ] Terminal 3: Frontend running (port 5173)
- [ ] Browser: http://localhost:5173

---

## 🔍 Verify Everything Works

1. Open: http://localhost:5173
2. Try: Sign Up → Create Account
3. Try: Sign In → Login
4. Try: Browse Cars → View Catalogue

---

## 🛑 To Stop (Reverse Order)

1. Terminal 3: Ctrl+C (Frontend)
2. Terminal 2: Ctrl+C (Spring Boot)
3. Terminal 1: Ctrl+C (RMI Server)
4. XAMPP: Stop MySQL

---

## ❗ If Something Fails

**Port 8080 already in use?**
```powershell
netstat -ano | findstr :8080
```
Find the PID (last number), then:
```powershell
taskkill /PID <PID_NUMBER> /F
```
Example: If you see `44160`, use: `taskkill /PID 44160 /F`
→ Or close the old Spring Boot terminal

**RMI Connection Error?**
→ Start RMI Server FIRST (Terminal 1)

**500 Error?**
→ Check Spring Boot terminal for error message

**Network Error?**
→ Check Spring Boot is running (Terminal 2)

**Database Error?**
→ Check MySQL is running in XAMPP
