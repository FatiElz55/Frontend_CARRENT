# Troubleshooting Guide

## 500 Internal Server Error on Registration

If you're getting a 500 error when trying to register a user, check these:

### 1. Check if RMI Server is Running

The RMI server MUST be running before Spring Boot starts.

**Start RMI Server:**
```powershell
cd C:\Users\elzfa\Desktop\Frontend_CARRENT\rmi-server
& "C:\Users\elzfa\Downloads\maven-mvnd-1.0.3-windows-amd64\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe" exec:java
```

You should see:
```
CarRentalService bound to RMI registry with name: CarRentalService
RMI Server is running and ready to accept requests...
```

### 2. Check Spring Boot Logs

Look at the Spring Boot console for error messages. The error will show what went wrong:
- "RMI server is not available" → RMI server not running
- "Error connecting to RMI server" → RMI connection issue
- SQL errors → Database connection issue
- Other exceptions → Check the stack trace

### 3. Check Database Connection

Make sure:
- XAMPP MySQL is running (port 3306)
- Database `car_rental_db` exists
- Tables `users`, `cars`, `reservations` exist

### 4. Test Database Connection

You can test if the database is accessible by checking phpMyAdmin:
- Go to: `http://localhost/phpmyadmin`
- Check if `car_rental_db` database exists
- Try running: `SELECT * FROM users;` (should work even if empty)

### 5. Common Issues

**Issue: "RMI server is not available"**
- Solution: Start RMI server first, then Spring Boot

**Issue: "Connection refused" or "Connection timeout"**
- Solution: Make sure RMI server is running on port 1099
- Check firewall settings

**Issue: SQL errors (Table doesn't exist, etc.)**
- Solution: Run the schema.sql script in phpMyAdmin

**Issue: "Access denied for user 'root'@'localhost'"**
- Solution: Check MySQL password in `DatabaseConnection.java` (currently set to empty string for XAMPP)

### 6. Verify Everything is Running

**Correct startup order:**
1. ✅ XAMPP MySQL (should be running)
2. ✅ RMI Server (start first, keep running)
3. ✅ Spring Boot API (start second, should connect to RMI)
4. ✅ Frontend (npm run dev)

**Check ports:**
- MySQL: 3306
- RMI Registry: 1099
- Spring Boot API: 8080
- Frontend (Vite): 5173

### 7. Check Console Logs

**RMI Server console should show:**
- "RMI Registry created on port 1099" or "RMI Registry already exists"
- "CarRentalService bound to RMI registry"

**Spring Boot console should show:**
- "Connected to RMI server at localhost:1099"
- "Started SpringApiApplication"

If you see connection errors in Spring Boot logs, the RMI server is not accessible.

