# Free Hosting Guide for Car Rental System

## 🎯 Overview

This project has **4 components** that need hosting:
1. **React Frontend** (Port 5173 - development, static build for production)
2. **Spring Boot REST API** (Port 8080)
3. **RMI Server** (Port 1099) ⚠️ *Most challenging for cloud hosting*
4. **MySQL Database**

---

## ⚠️ RMI Server Challenge

**RMI (Remote Method Invocation) is problematic for cloud hosting** because:
- Requires direct TCP connections on port 1099
- Needs proper network configuration for RMI registry
- Many free hosting services block or restrict RMI ports
- Firewall and NAT issues in cloud environments

### Solutions:
1. **Option A**: Run RMI Server locally, host everything else (Best for presentation)
2. **Option B**: Convert RMI to REST API (Significant code changes)
3. **Option C**: Use a VPS with full control (Requires setup)

---

## 🏆 **RECOMMENDED: Hybrid Approach** (Best for Presentation)

### Setup:
- **Frontend**: Vercel/Netlify (Free, automatic deployments)
- **Spring Boot API**: Railway/Render (Free tier)
- **MySQL Database**: Railway/Render free tier OR PlanetScale free tier
- **RMI Server**: Run locally on your machine (or convert to REST)

### Why This Works:
- Frontend can call the Spring API from anywhere
- Spring API can call RMI server on localhost (you run it during presentation)
- You only need to run RMI server locally during demo

---

## 📦 Detailed Hosting Options

### 1. **Frontend Hosting** (React)

#### **Option A: Vercel** (Recommended - Easiest)
✅ **Free tier**: Unlimited
✅ **Automatic deployments** from GitHub
✅ **Custom domains**
✅ **HTTPS included**

**Steps:**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variable: `VITE_API_URL=https://your-spring-api-url/api`

**Pros**: Fastest setup, automatic deployments, great performance
**Cons**: None for free tier

---

#### **Option B: Netlify**
✅ **Free tier**: 100GB bandwidth/month
✅ **Automatic deployments**
✅ **HTTPS included**

**Steps:**
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. New site from Git
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variable: `VITE_API_URL`

**Pros**: Easy setup, good free tier
**Cons**: Slightly slower than Vercel

---

#### **Option C: GitHub Pages**
✅ **Free**: Unlimited
⚠️ **Requires**: GitHub Actions for building

**Steps:**
1. Create `.github/workflows/deploy.yml`
2. Build React app and push to `gh-pages` branch
3. Enable GitHub Pages in repo settings

**Pros**: Free, integrated with GitHub
**Cons**: More setup, requires GitHub Actions

---

### 2. **Spring Boot API Hosting**

#### **Option A: Railway** (Recommended)
✅ **Free tier**: $5 credit/month (usually enough for small apps)
✅ **Easy database integration**
✅ **Automatic deployments**

**Steps:**
1. Create account at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select `spring-api` directory
4. Add MySQL database service (separate service)
5. Set environment variables:
   - `DB_URL=jdbc:mysql://host:port/database`
   - `DB_USER=username`
   - `DB_PASSWORD=password`
   - `RMI_SERVER_HOST=localhost` (if RMI runs locally) or your RMI server IP

**Cost**: Free $5 credit/month (usually sufficient)
**Pros**: Easy setup, includes database, good documentation
**Cons**: Credit-based (may need to pay if exceeded)

---

#### **Option B: Render**
✅ **Free tier**: 750 hours/month (enough for 24/7)
⚠️ **Limitation**: Spins down after 15 min inactivity (freeze/thaw)

**Steps:**
1. Create account at [render.com](https://render.com)
2. New Web Service → Connect GitHub
3. Build command: `cd spring-api && mvn clean package`
4. Start command: `java -jar target/spring-api-*.jar`
5. Add MySQL database (separate service)

**Cost**: Free (with limitations)
**Pros**: Truly free, easy setup
**Cons**: Cold starts (15-30 seconds after inactivity), limited resources

---

#### **Option C: Heroku** (Legacy - Not Recommended)
❌ **No longer has free tier** (discontinued Nov 2022)
⚠️ Requires paid plans now

---

#### **Option D: Oracle Cloud Always Free** (Advanced)
✅ **Free tier**: 2 VMs forever
⚠️ **Requires**: More technical setup

**Steps:**
1. Create Oracle Cloud account
2. Create Always Free VM (Ubuntu)
3. Install Java 17, Maven
4. Deploy Spring Boot app manually

**Cost**: Free forever (if you follow rules)
**Pros**: Full control, free forever
**Cons**: Complex setup, requires Linux knowledge

---

### 3. **MySQL Database Hosting**

#### **Option A: Railway** (If using Railway for API)
✅ **Included** in Railway project
✅ **Easy connection**

**Pros**: Integrated, easy setup
**Cons**: Uses Railway credit

---

#### **Option B: PlanetScale**
✅ **Free tier**: 5GB storage, 1 billion row reads/month
✅ **Serverless MySQL**
✅ **Branch-based database workflow**

**Steps:**
1. Create account at [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string
4. Update Spring Boot `application.properties`

**Pros**: Generous free tier, easy connection strings
**Cons**: Different syntax (they use Vitess), may need schema adjustments

---

#### **Option C: Supabase**
✅ **Free tier**: 500MB database
✅ **PostgreSQL** (not MySQL, but compatible)

**Pros**: Easy setup, good free tier
**Cons**: PostgreSQL (may need minor SQL changes)

---

#### **Option D: Render MySQL**
✅ **Free tier**: Included with Render account

**Pros**: Easy if using Render
**Cons**: Same cold start issues

---

### 4. **RMI Server Hosting** (Most Challenging)

#### **Option A: Run Locally** (Recommended for Presentation)
✅ **Simplest solution**
✅ **No hosting costs**

**Setup:**
1. Run RMI server on your local machine: `mvnd exec:java` in `rmi-server/`
2. Update Spring Boot API to connect to your machine's IP
3. Ensure firewall allows port 1099
4. Use ngrok for public access (see below)

**For Public Access (ngrok):**
1. Install ngrok: [ngrok.com](https://ngrok.com)
2. Run: `ngrok tcp 1099`
3. Use the provided public URL in Spring Boot config

**Pros**: Easy, free, works reliably
**Cons**: Your machine must be running during presentation

---

#### **Option B: Convert RMI to REST** (Long-term Solution)
⚠️ **Requires code changes**

Instead of RMI, make Spring API call database directly:
- Move DAO classes to Spring API
- Remove RMI layer
- Simplify architecture

**Pros**: Easier to host, standard REST architecture
**Cons**: Requires significant refactoring

---

#### **Option C: VPS (Virtual Private Server)**
✅ **Full control**

**Free Options:**
- **Oracle Cloud Always Free**: 2 VMs forever
- **Google Cloud**: $300 free credit (trial)
- **AWS**: Free tier (limited time)

**Steps:**
1. Create VM
2. Install Java 17, Maven
3. Deploy RMI server
4. Configure firewall
5. Use public IP

**Pros**: Full control, can host everything
**Cons**: Requires technical setup, some maintenance

---

## 🎯 **Recommended Setup for Presentation**

### **Minimal Setup** (Easiest):

```
┌─────────────────────────┐
│  Your Local Machine     │
│  - RMI Server (1099)    │
│  - ngrok tunnel         │
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│  Railway (Free)         │
│  - Spring Boot API      │
│  - MySQL Database       │
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│  Vercel (Free)          │
│  - React Frontend       │
└─────────────────────────┘
```

### **Steps:**

1. **Prepare Frontend:**
   ```bash
   # Build frontend
   npm run build
   
   # Deploy to Vercel
   # Set VITE_API_URL=https://your-railway-app.up.railway.app/api
   ```

2. **Deploy Spring Boot to Railway:**
   - Connect GitHub repo
   - Select `spring-api` folder
   - Add MySQL database service
   - Set environment variables for database connection
   - Set `RMI_SERVER_HOST=your-ngrok-url` or your public IP

3. **Run RMI Server Locally:**
   ```bash
   cd rmi-server
   mvnd exec:java
   ```

4. **Create Public Tunnel (ngrok):**
   ```bash
   ngrok tcp 1099
   # Use the provided URL (e.g., tcp://0.tcp.ngrok.io:12345)
   # Update Spring Boot config with this URL
   ```

5. **Test Everything:**
   - Frontend → Spring API → RMI Server → Database

---

## 📝 Configuration Changes Needed

### **Frontend (Vercel/Netlify):**
Add environment variable:
```
VITE_API_URL=https://your-spring-api-url/api
```

### **Spring Boot (Railway/Render):**
Update `application.properties`:
```properties
# Database
spring.datasource.url=jdbc:mysql://host:port/database
spring.datasource.username=user
spring.datasource.password=pass

# RMI Server connection
rmi.server.host=your-ngrok-url-or-ip
rmi.server.port=1099
```

### **RMI Server:**
Update connection string in Spring Boot to point to your RMI server.

---

## 🚀 **Quick Start - Railway + Vercel** (Recommended)

### **Step 1: Deploy Frontend to Vercel** (5 minutes)

1. Push code to GitHub
2. Go to vercel.com, sign up with GitHub
3. Import repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variable**: `VITE_API_URL` = (will add after Step 2)

---

### **Step 2: Deploy Spring API + Database to Railway** (10 minutes)

1. Go to railway.app, sign up
2. New Project → Deploy from GitHub
3. Add two services:
   - **Spring API Service**:
     - Root directory: `spring-api`
     - Build command: `mvn clean package`
     - Start command: `java -jar target/spring-api-*.jar`
   - **MySQL Database Service**:
     - Use Railway's MySQL template
4. Get database connection details
5. Add environment variables to Spring API:
   - Database URL, username, password (Railway provides these)
   - `RMI_SERVER_HOST=tcp://your-ngrok-url` (after Step 3)

---

### **Step 3: Setup RMI Server Locally** (2 minutes)

```bash
# Install ngrok (if not installed)
# Download from ngrok.com

# Run ngrok
ngrok tcp 1099

# Copy the URL (e.g., tcp://0.tcp.ngrok.io:12345)
# Update Spring Boot RMI_SERVER_HOST with this URL
```

---

### **Step 4: Update Frontend API URL**

1. Go to Vercel dashboard
2. Your project → Settings → Environment Variables
3. Add: `VITE_API_URL=https://your-railway-app.up.railway.app/api`
4. Redeploy

---

### **Step 5: Run Database Schema**

1. Connect to Railway MySQL database
2. Run `database/schema.sql` to create tables

---

## 💰 **Cost Summary**

| Service | Free Tier | Monthly Cost |
|---------|-----------|--------------|
| Vercel (Frontend) | Unlimited | $0 |
| Railway (API + DB) | $5 credit | $0-5 (usually free) |
| ngrok (RMI Tunnel) | Free (limited) | $0 or $8/month for better plan |
| **Total** | | **$0-8/month** |

---

## 🎤 **For Live Presentation**

### **Before Presentation:**
1. ✅ Deploy all services 1 day before
2. ✅ Test all endpoints
3. ✅ Start RMI server and ngrok
4. ✅ Have backup: local run script ready

### **During Presentation:**
1. ✅ Show deployed frontend URL
2. ✅ Keep RMI server running locally
3. ✅ Keep ngrok running
4. ✅ Have backup plan (local version ready)

### **Backup Plan:**
Keep a local version running:
- Frontend: `npm run dev` (localhost:5173)
- Spring API: `mvnd spring-boot:run` (localhost:8080)
- RMI Server: `mvnd exec:java` (localhost:1099)
- Database: Local MySQL

---

## 🐛 **Troubleshooting**

### **RMI Connection Issues:**
- ✅ Ensure firewall allows port 1099
- ✅ Use ngrok for public access
- ✅ Check `RMI_SERVER_HOST` is correct
- ✅ Verify RMI server is running before API starts

### **Database Connection:**
- ✅ Check connection string format
- ✅ Verify database is accessible (not private-only)
- ✅ Ensure schema is created

### **Frontend Can't Reach API:**
- ✅ Check CORS settings in Spring Boot
- ✅ Verify `VITE_API_URL` is set correctly
- ✅ Check API is deployed and running

---

## 📚 **Additional Resources**

- [Vercel Deployment Guide](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [ngrok Documentation](https://ngrok.com/docs)

---

## ✅ **Final Recommendation**

**For a presentation, use:**
1. **Vercel** for frontend (fastest, easiest)
2. **Railway** for Spring API + MySQL (easiest full-stack hosting)
3. **Local RMI Server + ngrok** (most reliable for RMI)

This combination gives you:
- ✅ Professional URLs (not localhost)
- ✅ Free hosting (or very cheap)
- ✅ Easy setup
- ✅ Reliable during presentation
- ✅ Backup option available

Good luck with your presentation! 🚀

