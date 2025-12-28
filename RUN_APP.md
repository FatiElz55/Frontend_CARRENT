# Running the Car Rental System - Quick Guide

> **📋 For detailed presentation instructions, see [PRESENTATION_GUIDE.md](PRESENTATION_GUIDE.md)**

## Prerequisites
- ✅ XAMPP MySQL running (port 3306)
- ✅ Database `car_rental_db` created with all tables
- ✅ Java 17 installed
- ✅ Maven (mvnd) available
- ✅ Node.js and npm installed

---

## Step-by-Step Startup

### 1. Start MySQL Database
- Open XAMPP Control Panel
- Start **MySQL** service
- Verify it's running on port 3306

---

### 2. Start RMI Server

Open a **new terminal** and run:

```powershell
cd C:\Users\elzfa\Desktop\Frontend_CARRENT\rmi-server
& "C:\Users\elzfa\Downloads\maven-mvnd-1.0.3-windows-amd64\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe" exec:java
```

**Or use the batch file:**
```powershell
cd C:\Users\elzfa\Desktop\Frontend_CARRENT\rmi-server
.\start-rmi.bat
```

**Wait for:** 
```
CarRentalService bound to RMI registry with name: CarRentalService
RMI Server is running and ready to accept requests...
Press Ctrl+C to stop the server...
```

**⚠️ IMPORTANT:** The server will keep running. **Keep this terminal window open!** Do NOT close it or press Ctrl+C until you're done using the application.

---

### 3. Start Spring Boot API

Open a **new terminal** and run:

```powershell
cd C:\Users\elzfa\Desktop\Frontend_CARRENT\spring-api
& "C:\Users\elzfa\Downloads\maven-mvnd-1.0.3-windows-amd64\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe" spring-boot:run
```

**Wait for:**
```
Started SpringApiApplication in X.XX seconds
```

**Verify:** Look for "Connected to RMI server at localhost:1099" in the logs

**Keep this terminal window open!** ⚠️

---

### 4. Start Frontend

Open a **new terminal** and run:

```powershell
cd C:\Users\elzfa\Desktop\Frontend_CARRENT
npm run dev
```

**Wait for:**
```
  VITE vX.X.X  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## Service URLs

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:5173 | 5173 |
| Spring Boot API | http://localhost:8080 | 8080 |
| RMI Server | rmi://localhost:1099 | 1099 |
| MySQL | localhost | 3306 |

---

## Startup Order (IMPORTANT)

1. ✅ **MySQL** (XAMPP)
2. ✅ **RMI Server** (must be running before Spring Boot)
3. ✅ **Spring Boot API** (waits for RMI server)
4. ✅ **Frontend** (can start anytime)

---

## Stopping the Application

Press `Ctrl+C` in each terminal window (reverse order):
1. Frontend terminal
2. Spring Boot terminal
3. RMI Server terminal
4. Stop MySQL in XAMPP Control Panel

---

## Troubleshooting

### "Error connecting to RMI server"
- Make sure RMI Server is running (Step 2)
- Check that RMI Server shows "CarRentalService bound..."

### "500 Internal Server Error"
- Check Spring Boot logs for detailed error
- Verify RMI Server is connected
- Check database connection

### Frontend shows "Network Error"
- Verify Spring Boot is running on port 8080
- Check browser console for API errors

### Database connection errors
- Verify MySQL is running in XAMPP
- Check database `car_rental_db` exists
- Verify tables exist (users, cars, reservations)

---

## Quick Commands Reference

```powershell
# RMI Server (mainClass is configured in pom.xml, so just use exec:java)
cd rmi-server
& "C:\Users\elzfa\Downloads\maven-mvnd-1.0.3-windows-amd64\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe" exec:java

# Or use batch file:
.\start-rmi.bat

# Spring Boot
cd spring-api
& "C:\Users\elzfa\Downloads\maven-mvnd-1.0.3-windows-amd64\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe" spring-boot:run

# Frontend
npm run dev
```

---

**Note:** All three services (RMI Server, Spring Boot, Frontend) must be running simultaneously for the application to work properly.
