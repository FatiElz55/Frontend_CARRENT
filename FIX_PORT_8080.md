# Fix: Port 8080 Already in Use

## Quick Fix

If you get the error "Port 8080 was already in use", it means there's already a Spring Boot instance running.

### Solution 1: Kill the Process (Recommended)

**Find the process:**
```powershell
netstat -ano | findstr :8080
```

**Example output:**
```
TCP    0.0.0.0:8080           0.0.0.0:0              LISTENING       44160
```
The last number (44160) is the PID you need.

**Kill the process (use the PID number from above):**
```powershell
taskkill /PID 44160 /F
```

**Important:** Always use the PID number shown in the netstat output, not the example number!

### Solution 2: Close the Old Terminal

If you have another terminal window running Spring Boot, simply:
1. Go to that terminal
2. Press `Ctrl+C` to stop it

### Solution 3: Use a Different Port (Not Recommended for Presentation)

Edit `spring-api/src/main/resources/application.properties`:
```properties
server.port=8081
```

Then update frontend API URL accordingly.

---

## Prevention

**Always stop Spring Boot properly:**
- Press `Ctrl+C` in the Spring Boot terminal
- Wait for it to stop completely
- Then start it again

**Check if port is in use before starting:**
```powershell
netstat -ano | findstr :8080
```

If you see output, there's already something running on port 8080.
