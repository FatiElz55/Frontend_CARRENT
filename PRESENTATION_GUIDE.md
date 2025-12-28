# Car Rental System - Presentation Setup Guide

## Quick Checklist Before Starting

- [ ] XAMPP is installed and MySQL is running
- [ ] Database `car_rental_db` is created with all tables
- [ ] Java 17 is installed
- [ ] Maven (mvnd) is available
- [ ] Node.js and npm are installed

---

## Step-by-Step Startup Instructions

### STEP 1: Verify MySQL Database is Running

1. **Open XAMPP Control Panel**
2. **Start MySQL** (click "Start" button)
   - Wait until the MySQL status shows "Running" (green)
3. **Verify Database:**
   - Open phpMyAdmin: `http://localhost/phpmyadmin`
   - Check that `car_rental_db` database exists
   - Check that tables exist: `users`, `cars`, `reservations`

**✅ Success indicator:** MySQL is running on port 3306

---

### STEP 2: Start RMI Server

1. **Open PowerShell** (Terminal 1)
2. **Navigate to project:**
   ```powershell
   cd C:\Users\elzfa\Desktop\Frontend_CARRENT\rmi-server
   ```
3. **Start RMI Server:**
   ```powershell
   & "C:\Users\elzfa\Downloads\maven-mvnd-1.0.3-windows-amd64\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe" exec:java
   ```
   
   **OR use the batch file:**
   ```powershell
   .\start-rmi.bat
   ```

4. **Wait for these messages:**
   ```
   RMI Registry already exists on port 1099
   CarRentalService bound to RMI registry with name: CarRentalService
   RMI Server is running and ready to accept requests...
   Press Ctrl+C to stop the server...
   ```

**✅ Success indicator:** You see "RMI Server is running..." and the terminal stays open (doesn't exit)

**⚠️ IMPORTANT:** Keep this terminal window open! Do NOT close it.

---

### STEP 3: Start Spring Boot API

1. **Open a NEW PowerShell** (Terminal 2)
2. **Navigate to Spring Boot project:**
   ```powershell
   cd C:\Users\elzfa\Desktop\Frontend_CARRENT\spring-api
   ```
3. **Start Spring Boot:**
   ```powershell
   & "C:\Users\elzfa\Downloads\maven-mvnd-1.0.3-windows-amd64\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe" spring-boot:run
   ```

4. **Wait for these messages:**
   ```
   Connected to RMI server at localhost:1099
   Tomcat started on port 8080 (http) with context path '/'
   Started SpringApiApplication in X.XX seconds
   ```

**✅ Success indicator:** You see "Started SpringApiApplication" and "Connected to RMI server"

**⚠️ IMPORTANT:** Keep this terminal window open! Do NOT close it.

---

### STEP 4: Start Frontend

1. **Open a NEW PowerShell** (Terminal 3)
2. **Navigate to project root:**
   ```powershell
   cd C:\Users\elzfa\Desktop\Frontend_CARRENT
   ```
3. **Start Frontend:**
   ```powershell
   npm run dev
   ```

4. **Wait for these messages:**
   ```
   VITE vX.X.X  ready in XXX ms
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

**✅ Success indicator:** You see the localhost URL and no errors

---

### STEP 5: Open the Application

1. **Open your web browser**
2. **Navigate to:** `http://localhost:5173`
3. **You should see the Car Rental System homepage**

---

## Summary: What Should Be Running

| Service | Terminal | Port | Status Check |
|---------|----------|------|--------------|
| MySQL (XAMPP) | - | 3306 | Green "Running" in XAMPP |
| RMI Server | Terminal 1 | 1099 | "RMI Server is running..." |
| Spring Boot API | Terminal 2 | 8080 | "Started SpringApiApplication" |
| Frontend (Vite) | Terminal 3 | 5173 | "Local: http://localhost:5173/" |

---

## Startup Order (CRITICAL!)

**Always start in this exact order:**

1. ✅ **MySQL** (XAMPP Control Panel)
2. ✅ **RMI Server** (Terminal 1) - **MUST be first!**
3. ✅ **Spring Boot API** (Terminal 2) - **Waits for RMI Server**
4. ✅ **Frontend** (Terminal 3) - **Can start anytime**

---

## Testing the Application

After all services are running:

1. **Register a new user:**
   - Click "Sign Up"
   - Fill in the form
   - Submit

2. **Login:**
   - Click "Sign In"
   - Enter credentials
   - Submit

3. **View cars (as client):**
   - Browse the catalogue
   - View car details

4. **Add car (as owner):**
   - Login as owner
   - Go to "Owner" page
   - Add a new car

5. **Make a reservation:**
   - Select a car
   - Choose dates
   - Complete reservation

---

## Stopping the Application

**Stop in reverse order (press Ctrl+C in each terminal):**

1. Frontend terminal (Terminal 3)
2. Spring Boot terminal (Terminal 2)
3. RMI Server terminal (Terminal 1)
4. Stop MySQL in XAMPP Control Panel

---

## Common Issues & Quick Fixes

### ❌ "RMI Server is not available"
- **Fix:** Make sure RMI Server (Terminal 1) is running
- **Check:** Do you see "RMI Server is running..." in Terminal 1?

### ❌ "Cannot connect to RMI server"
- **Fix:** Start RMI Server FIRST, then Spring Boot
- **Check:** RMI Server must be running before Spring Boot starts

### ❌ "500 Internal Server Error"
- **Fix:** Check Spring Boot terminal for error messages
- **Check:** Make sure all services are running

### ❌ Frontend shows "Network Error"
- **Fix:** Make sure Spring Boot is running on port 8080
- **Check:** Terminal 2 shows "Started SpringApiApplication"

### ❌ Database connection errors
- **Fix:** Make sure MySQL is running in XAMPP
- **Check:** XAMPP shows MySQL as "Running" (green)

### ❌ "Port 8080 was already in use"
- **Fix:** Kill the old Spring Boot process:
  ```powershell
  netstat -ano | findstr :8080
  taskkill /PID <PID> /F
  ```
- **Or:** Close the old Spring Boot terminal window and press Ctrl+C

---

## Presentation Tips

1. **Start all services BEFORE the presentation** (during preparation time)
2. **Have all 3 terminal windows visible** (or minimized but easily accessible)
3. **Test the application once** before the presentation starts
4. **Keep XAMPP Control Panel open** to show MySQL is running
5. **Have the browser ready** with the application already loaded

---

## Quick Command Reference

```powershell
# Terminal 1: RMI Server
cd C:\Users\elzfa\Desktop\Frontend_CARRENT\rmi-server
.\start-rmi.bat

# Terminal 2: Spring Boot
cd C:\Users\elzfa\Desktop\Frontend_CARRENT\spring-api
& "C:\Users\elzfa\Downloads\maven-mvnd-1.0.3-windows-amd64\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe" spring-boot:run

# Terminal 3: Frontend
cd C:\Users\elzfa\Desktop\Frontend_CARRENT
npm run dev
```

---

## Architecture Overview (For Presentation)

```
┌─────────────────┐
│   Frontend      │  React (Port 5173)
│   (Browser)     │
└────────┬────────┘
         │ HTTP REST API
         ▼
┌─────────────────┐
│  Spring Boot    │  REST API (Port 8080)
│  (Middleware)   │
└────────┬────────┘
         │ RMI
         ▼
┌─────────────────┐
│   RMI Server    │  RMI Registry (Port 1099)
│  (Business      │
│   Logic)        │
└────────┬────────┘
         │ JDBC
         ▼
┌─────────────────┐
│   MySQL         │  Database (Port 3306)
│   (XAMPP)       │
└─────────────────┘
```

---

**Good luck with your presentation! 🚀**
