# Car Rental System - Distributed Application

## 📋 Project Overview

This is a **distributed car rental management system** that allows users to rent cars and owners to manage their vehicle fleet. The application follows a **3-tier distributed architecture** using **RMI (Remote Method Invocation)** for inter-process communication between services.

### Key Features

- **Dual Role System**: Separate interfaces for Clients (renters) and Owners (car providers)
- **Car Management**: Owners can add, edit, and delete their cars with image uploads
- **Reservation System**: Clients can browse, book, and manage car reservations with date blocking
- **Approval Workflow**: Reservations start as "pending" and require owner approval
- **User Profiles**: Complete profile management with authentication and password changes
- **Real-time Availability**: Dynamic date blocking based on confirmed reservations

---

## 🏗️ Architecture & Logic

### System Architecture

```
┌─────────────────┐
│  React Frontend │  (Port 5173)
│   (Vite + UI)   │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Spring Boot    │  (Port 8080)
│   REST API      │
└────────┬────────┘
         │ RMI
         ▼
┌─────────────────┐
│  RMI Server     │  (Port 1099)
│  (Business Logic)│
└────────┬────────┘
         │ JDBC
         ▼
┌─────────────────┐
│   MySQL Database│
│  (Data Storage) │
└─────────────────┘
```

### Application Flow

1. **User Authentication**: Users register/login through React frontend
2. **Role-Based Routing**: System routes users to Client or Owner interface based on role
3. **API Communication**: Frontend communicates with Spring Boot REST API via HTTP
4. **RMI Communication**: Spring Boot API uses RMI to communicate with RMI Server
5. **Database Access**: RMI Server handles all database operations via JDBC
6. **Data Flow**: Responses flow back through RMI → Spring API → Frontend

### Business Logic

- **Reservations**: Start as "pending" status, require owner approval to become "confirmed"
- **Date Blocking**: Only **confirmed** reservations block calendar dates
- **Availability**: Car availability is dynamic based on confirmed reservations, not stored statically
- **Owner Restrictions**: Owners cannot book their own cars
- **Price Calculation**: Uses `BigDecimal` for precise currency handling (MAD - Moroccan Dirham)

---

## 📁 Project Structure

### **Frontend** (React + Vite)

**Technology Stack:**
- **React 18.3.1** - UI framework
- **Vite 7.2.4** - Build tool and dev server
- **React Router DOM 7.10.0** - Client-side routing
- **TailwindCSS 3.4.0** - Utility-first CSS framework
- **Framer Motion 12.23.25** - Animation library
- **Axios 1.13.2** - HTTP client
- **React DatePicker 9.1.0** - Date selection component
- **React Hot Toast 2.6.0** - Toast notifications
- **React International Phone 4.3.4** - Phone number input

#### Core Files:

**Entry Point & Configuration:**
- `src/main.jsx` - React application entry point
- `src/App.jsx` - Main app component with routing and protected routes
- `vite.config.mjs` - Vite configuration
- `tailwind.config.js` - TailwindCSS configuration
- `package.json` - Frontend dependencies and scripts

**Authentication:**
- `src/SignIn.jsx` - User login page with email/password authentication
- `src/SignUp.jsx` - User registration with multi-step form, image compression for documents

**Pages:**
- `src/pages/Catalogue.jsx` - Car browsing page with filters (brand, city, availability)
- `src/pages/CarDetailsPage.jsx` - Individual car details with image gallery
- `src/pages/ReservationPage.jsx` - Multi-step reservation form (dates, options, payment)
- `src/pages/MyBookings.jsx` - User's booking history with status filtering (upcoming, active, completed, pending)
- `src/pages/ProfilePage.jsx` - User profile management (edit info, change password, upload documents)
- `src/OwnerPage.jsx` - Owner dashboard with car management and booking requests

**Components:**
- `src/components/Navbar.jsx` - Main navigation bar with role-based menu
- `src/components/Footer.jsx` - Footer component
- `src/components/catalogue/CarCard.jsx` - Car card display for catalogue
- `src/components/catalogue/DetailsModal.jsx` - Modal for car details preview
- `src/components/catalogue/FiltersBar.jsx` - Filtering UI for cars
- `src/components/owner/OwnerCarCard.jsx` - Car card for owner's car list
- `src/components/owner/AddCarModal.jsx` - Modal for adding/editing cars with image upload

**Services & Utilities:**
- `src/services/api.js` - Axios-based API client with all endpoint definitions
- `src/utils/geo.js` - Geocoding utilities for location services
- `src/data/mockData.js` - Mock data (legacy, mostly unused now)

**Styles:**
- `src/index.css` - Global styles, dark mode support, Tailwind imports

---

### **Backend - Spring Boot REST API**

**Technology Stack:**
- **Spring Boot 4.0.0** - Framework for REST API
- **Spring Web MVC** - Web layer for REST endpoints
- **Java 17** - Programming language
- **Maven** - Build tool

#### Core Files:

**Application Entry:**
- `spring-api/src/main/java/com/distributed/spring_api/SpringApiApplication.java` - Spring Boot application main class

**Controllers (REST Endpoints):**
- `spring-api/src/main/java/com/distributed/spring_api/controller/CarController.java`
  - `GET /api/cars` - Get all cars (with optional filters)
  - `GET /api/cars/{id}` - Get car by ID
  - `GET /api/cars/owner/{ownerId}` - Get cars by owner
  - `POST /api/cars` - Add new car
  - `PUT /api/cars/{id}` - Update car
  - `DELETE /api/cars/{id}` - Delete car

- `spring-api/src/main/java/com/distributed/spring_api/controller/ReservationController.java`
  - `GET /api/reservations` - Get all reservations
  - `GET /api/reservations/{id}` - Get reservation by ID
  - `GET /api/reservations/user/{userId}` - Get user's reservations
  - `GET /api/reservations/car/{carId}` - Get reservations for a car
  - `POST /api/reservations` - Create new reservation
  - `PUT /api/reservations/{id}` - Update reservation
  - `DELETE /api/reservations/{id}` - Cancel reservation

- `spring-api/src/main/java/com/distributed/spring_api/controller/UserController.java`
  - `GET /api/users` - Get all users
  - `GET /api/users/{id}` - Get user by ID
  - `POST /api/users/register` - Register new user
  - `POST /api/users/authenticate` - User login
  - `PUT /api/users/{id}` - Update user
  - `POST /api/users/{id}/change-password` - Change user password

**Service Layer:**
- `spring-api/src/main/java/com/distributed/spring_api/service/RMIClientService.java` - RMI client that communicates with RMI Server

**Exception Handling:**
- `spring-api/src/main/java/com/distributed/spring_api/exception/GlobalExceptionHandler.java` - Global exception handler for API errors

**Model Classes:**
- `spring-api/src/main/java/com/distributed/spring_api/model/Car.java` - Car entity (matches RMI model)
- `spring-api/src/main/java/com/distributed/spring_api/model/Reservation.java` - Reservation entity
- `spring-api/src/main/java/com/distributed/spring_api/model/User.java` - User entity

**RMI Interface (Shared):**
- `spring-api/src/main/java/com/distributed/rmi/service/CarRentalService.java` - RMI service interface (shared with RMI server)

**Configuration:**
- `spring-api/src/main/resources/application.properties` - Spring Boot configuration (port, CORS, etc.)

---

### **RMI Server** (Business Logic Layer)

**Technology Stack:**
- **Java RMI** - Remote Method Invocation framework
- **Java 17** - Programming language
- **MySQL Connector 8.0.33** - JDBC driver for MySQL
- **Gson 2.10.1** - JSON serialization/deserialization
- **Maven** - Build tool

#### Core Files:

**Server Entry Point:**
- `rmi-server/src/main/java/com/distributed/rmi/server/RMIServer.java` - RMI server startup, binds service to registry on port 1099

**Service Interface:**
- `rmi-server/src/main/java/com/distributed/rmi/service/CarRentalService.java` - Remote interface defining all business operations

**Service Implementation:**
- `rmi-server/src/main/java/com/distributed/rmi/service/CarRentalServiceImpl.java`
  - Implements all business logic
  - User operations (register, authenticate, update, change password)
  - Car operations (create, update, delete, search, get by owner)
  - Reservation operations (create, update, cancel, get by user/car)
  - **Key Logic**: Only blocks bookings if car is in "maintenance", checks for overlapping **confirmed** reservations only

**Data Access Layer (DAO):**
- `rmi-server/src/main/java/com/distributed/rmi/dao/UserDAO.java`
  - Database operations for users (CRUD, authentication)
  - Handles password hashing, profile picture storage
  - Proper NULL handling for boolean fields

- `rmi-server/src/main/java/com/distributed/rmi/dao/CarDAO.java`
  - Database operations for cars (CRUD, search, get by owner)
  - Image URL storage (JSON arrays for multiple images)
  - Dynamic availability calculation
  - `BigDecimal` precision handling for prices

- `rmi-server/src/main/java/com/distributed/rmi/dao/ReservationDAO.java`
  - Database operations for reservations (CRUD)
  - Overlap detection methods:
    - `hasConfirmedReservationOverlap()` - Checks for overlapping confirmed reservations only
    - `hasActiveReservationOverlap()` - Checks for active (pending + confirmed) reservations
  - Get reservations by user ID, car ID

**Model Classes:**
- `rmi-server/src/main/java/com/distributed/rmi/model/User.java` - User entity with Serializable
- `rmi-server/src/main/java/com/distributed/rmi/model/Car.java` - Car entity with BigDecimal for price
- `rmi-server/src/main/java/com/distributed/rmi/model/Reservation.java` - Reservation entity with status tracking

**Utilities:**
- `rmi-server/src/main/java/com/distributed/rmi/util/DatabaseConnection.java` - Database connection manager using connection pooling

**Configuration:**
- `rmi-server/src/main/resources/database.properties` - Database connection configuration (URL, username, password)

---

### **Database** (MySQL)

**Technology Stack:**
- **MySQL 8.0+** - Relational database management system
- **SQL** - Database query language

#### Core Files:

- `database/schema.sql` - Complete database schema definition
  - **users table**: Stores client and owner accounts
    - Fields: id, full_name, email, password (hashed), role (client/owner), phone, address, profile picture, documents
  - **cars table**: Stores car information
    - Fields: id, name, brand, price_per_day (DECIMAL), city, availability, owner_id, images (JSON), seats, fuel_type, gearbox, coordinates
  - **reservations table**: Stores booking information
    - Fields: id, user_id, car_id, start_date, end_date, days, insurance_type, extras (JSON), total_price (DECIMAL), status (pending/confirmed/cancelled/completed)

- `database/verify_indexes.sql` - Index verification script for performance optimization
  - Indexes on: cars.availability, cars.city, cars.brand, reservations.user_id, reservations.car_id, reservations.status, users.email, users.role

#### Database Schema Details:

**Users Table:**
- Primary key: `id` (BIGINT AUTO_INCREMENT)
- Unique constraint: `email`
- Role: ENUM('client', 'owner')
- Timestamps: `created_at`, `updated_at`

**Cars Table:**
- Primary key: `id` (BIGINT AUTO_INCREMENT)
- Foreign key: `owner_id` → users.id (CASCADE DELETE)
- Availability: ENUM('available', 'reserved', 'maintenance')
- Price: DECIMAL(10, 2) for precise currency
- Images: TEXT field storing JSON array of image URLs
- Location: latitude, longitude (DECIMAL)

**Reservations Table:**
- Primary key: `id` (BIGINT AUTO_INCREMENT)
- Foreign keys: `user_id` → users.id, `car_id` → cars.id (CASCADE DELETE)
- Status: ENUM('pending', 'confirmed', 'cancelled', 'completed')
- Dates: DATE type for start_date and end_date
- Price: DECIMAL(10, 2) for total_price
- Extras: TEXT field storing JSON array

---

## 🔄 Data Flow Examples

### Example 1: User Registration
```
Frontend (SignUp.jsx)
  ↓ HTTP POST /api/users/register
Spring API (UserController)
  ↓ RMI call: register()
RMI Server (CarRentalServiceImpl)
  ↓ JDBC INSERT
Database (users table)
  ↓ Response flows back
Frontend (success/error handling)
```

### Example 2: Creating a Reservation
```
Frontend (ReservationPage.jsx)
  ↓ Validates dates (blocks confirmed reservation dates)
  ↓ HTTP POST /api/reservations
Spring API (ReservationController)
  ↓ RMI call: createReservation()
RMI Server (CarRentalServiceImpl)
  ↓ Checks: car exists, not in maintenance
  ↓ Checks: no overlapping confirmed reservations
  ↓ Sets status to "pending"
  ↓ JDBC INSERT
Database (reservations table)
  ↓ Response with reservation ID
Frontend (shows success message, redirects)
```

### Example 3: Owner Approving a Reservation
```
Frontend (OwnerPage.jsx - Demands view)
  ↓ HTTP PUT /api/reservations/{id}
Spring API (ReservationController)
  ↓ RMI call: updateReservation() with status="confirmed"
RMI Server (CarRentalServiceImpl)
  ↓ JDBC UPDATE reservations SET status='confirmed'
Database (reservations table updated)
  ↓ Response
Frontend (reloads demands list)
```

---

## 🛠️ Technology Summary by Layer

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI component library |
| | Vite 7 | Fast build tool and dev server |
| | React Router | Client-side routing |
| | TailwindCSS | Utility-first CSS framework |
| | Framer Motion | Animations |
| | Axios | HTTP client for API calls |
| | React DatePicker | Date selection component |
| | React Hot Toast | User notifications |
| | React International Phone | Phone number input |
| **Backend API** | Spring Boot 4 | REST API framework |
| | Spring Web MVC | HTTP request handling |
| | Java 17 | Programming language |
| | Maven | Dependency management |
| **RMI Server** | Java RMI | Distributed communication |
| | MySQL Connector | Database connectivity |
| | Gson | JSON serialization |
| | Java 17 | Programming language |
| | Maven | Dependency management |
| **Database** | MySQL 8.0+ | Relational database |
| | SQL | Query language |
| | JDBC | Database access protocol |

---

## 🚀 Running the Application

### Prerequisites

Before running the application, ensure you have the following installed:

1. **Node.js 18+ and npm**
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **Java 17 JDK or higher**
   - Download from: https://www.oracle.com/java/technologies/downloads/ or use OpenJDK
   - Verify installation: `java -version`
   - Ensure `JAVA_HOME` is set correctly (optional but recommended)

3. **Maven or Maven Daemon (mvnd)**
   - Option A: Install Maven from https://maven.apache.org/download.cgi
   - Option B: Use Maven Wrapper (included in spring-api project)
   - Option C: Use Maven Daemon from XAMPP (if you have XAMPP installed)
   - The provided PowerShell scripts will auto-detect Maven installations

4. **MySQL 8.0+**
   - Option A: Install MySQL from https://dev.mysql.com/downloads/mysql/
   - Option B: Use XAMPP which includes MySQL (recommended for Windows)
   - Default configuration uses: `localhost:3306`, user: `root`, password: (empty)

5. **PowerShell** (for Windows startup scripts)
   - Pre-installed on Windows 10/11

### Step-by-Step Setup Instructions

#### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Frontend_CARRENT
```

#### Step 2: Database Setup

1. **Start MySQL Server**
   - If using XAMPP: Start MySQL from XAMPP Control Panel
   - If using standalone MySQL: Start MySQL service

2. **Create the Database**
   - Open MySQL command line or use a MySQL client (phpMyAdmin, MySQL Workbench, etc.)
   - Run the schema file:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   Or copy and paste the contents of `database/schema.sql` into your MySQL client
   
   - This will create:
     - Database: `car_rental_db`
     - Tables: `users`, `cars`, `reservations`
     - All necessary indexes

3. **Verify Database Connection**
   - Database URL: `jdbc:mysql://localhost:3306/car_rental_db`
   - Username: `root`
   - Password: (empty by default in XAMPP)
   - If your MySQL has a password, update `rmi-server/src/main/resources/database.properties`

#### Step 3: Start RMI Server (Port 1099)

**Option A: Using PowerShell Script (Recommended for Windows)**

```powershell
cd rmi-server
.\START_RMI_SERVER.ps1
```

The script will:
- Check for Java installation
- Auto-detect Maven/Maven Daemon (checks PATH, XAMPP location, and common install paths)
- Build the project
- Start the RMI server on port 1099

**Option B: Using Maven Directly (if Maven is in PATH)**

```bash
cd rmi-server
mvn clean install
mvn exec:java -Dexec.mainClass="com.distributed.rmi.server.RMIServer"
```

**Option C: Using Maven Daemon from XAMPP**

If you have XAMPP with Maven Daemon:
```powershell
cd rmi-server
& "C:\xampp\apache\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.exe" exec:java -Dexec.mainClass="com.distributed.rmi.server.RMIServer"
```

**Expected Output:**
```
RMI Registry created on port 1099
CarRentalService bound to RMI registry with name: CarRentalService
RMI Server is running and ready to accept requests...
```

**Keep this terminal window open!** The RMI server must remain running.

#### Step 4: Start Spring Boot API (Port 8080)

**Option A: Using PowerShell Script (Recommended for Windows)**

```powershell
cd spring-api
.\START_SPRING_API.ps1
```

The script will:
- Check for Java installation
- Prefer Maven Wrapper (mvnw.cmd) if available
- Auto-detect Maven/Maven Daemon as fallback
- Start the Spring Boot application on port 8080

**Option B: Using Maven Wrapper (Recommended - No Maven Installation Needed)**

```bash
cd spring-api
.\mvnw.cmd spring-boot:run
```

On Linux/Mac:
```bash
cd spring-api
./mvnw spring-boot:run
```

**Option C: Using Maven Directly (if Maven is in PATH)**

```bash
cd spring-api
mvn spring-boot:run
```

**Expected Output:**
```
Started SpringApiApplication in X.XXX seconds
Connected to RMI server at localhost:1099
```

**Keep this terminal window open!** The Spring API must remain running.

#### Step 5: Install Frontend Dependencies

```bash
# Make sure you're in the Frontend_CARRENT directory (project root)
npm install
```

This installs all React dependencies including Vite, React Router, TailwindCSS, etc.

**Note:** If you encounter module errors, try:
```bash
# Clean install (removes node_modules and reinstalls)
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm cache clean --force
npm install
```

#### Step 6: Start React Frontend (Port 5173)

```bash
npm run dev
```

**Expected Output:**
```
  VITE v7.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and navigate to: **http://localhost:5173**

**Keep this terminal window open!** The frontend dev server must remain running.

### Complete Startup Order Summary

1. ✅ **MySQL Database** - Start MySQL service and create database
2. ✅ **RMI Server** - Run on port **1099** (keep running)
3. ✅ **Spring Boot API** - Run on port **8080** (keep running)
4. ✅ **React Frontend** - Run on port **5173** (keep running)

### Verification Checklist

After starting all services, verify:

- [ ] MySQL is running and `car_rental_db` database exists
- [ ] RMI Server shows "RMI Server is running and ready to accept requests..."
- [ ] Spring API shows "Connected to RMI server at localhost:1099"
- [ ] Frontend loads at http://localhost:5173
- [ ] No error messages in any terminal window

### Troubleshooting

**Problem: Maven not found**
- Solution: The PowerShell scripts will provide installation instructions
- Alternative: Use Maven Wrapper (`mvnw.cmd`) in spring-api directory
- Alternative: Install Maven and add to PATH

**Problem: Port already in use**
- Port 1099 (RMI): Stop any other RMI servers or Java processes
- Port 8080 (Spring API): Stop any other services using port 8080
- Port 5173 (Frontend): Vite will automatically try the next available port

**Problem: Cannot connect to database**
- Verify MySQL is running
- Check `rmi-server/src/main/resources/database.properties` for correct credentials
- Verify database `car_rental_db` exists
- Try connecting manually: `mysql -u root -p`

**Problem: RMI connection failed in Spring API**
- Ensure RMI Server is running BEFORE starting Spring API
- Check RMI Server output for "RMI Server is running..."
- Verify firewall isn't blocking port 1099

**Problem: Frontend shows connection errors**
- Verify Spring API is running on port 8080
- Check browser console for specific error messages
- Verify CORS is enabled in Spring Boot (should be enabled by default)

**Problem: npm install fails or modules corrupted**
- Run: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run: `npm install` again

### Configuration Files

Key configuration files you may need to modify:

- **Database Connection**: `rmi-server/src/main/resources/database.properties`
  ```properties
  db.url=jdbc:mysql://localhost:3306/car_rental_db
  db.user=root
  db.password=your_password_here
  ```

- **Spring API Port**: `spring-api/src/main/resources/application.properties`
  ```properties
  server.port=8080
  rmi.server.host=localhost
  rmi.server.port=1099
  ```

- **Frontend API URL**: `src/services/api.js` (if API runs on different port)

---

## 📝 Key Design Decisions

1. **Distributed Architecture**: Using RMI separates business logic from API layer, allowing for scalability
2. **Status-Based Booking**: Reservations start as "pending" requiring owner approval, preventing automatic double-booking
3. **Dynamic Availability**: Car availability is calculated from confirmed reservations, not stored statically
4. **Date Blocking**: Only confirmed reservations block calendar dates; pending reservations allow multiple requests for same dates
5. **Precision Handling**: Using `BigDecimal` for currency ensures accurate price calculations
6. **Image Compression**: Client-side image compression prevents payload size issues with MySQL
7. **Role-Based Access**: Separate interfaces and routing for clients and owners

---

## 🔐 Security Features

- Password hashing (handled in RMI server)
- Protected routes based on authentication status
- Role-based access control
- Input validation on frontend and backend
- SQL injection prevention via PreparedStatements
- CORS configuration in Spring Boot

---

## 📦 Key Dependencies

### Frontend
- `react`, `react-dom` - Core React library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `tailwindcss` - Styling
- `framer-motion` - Animations
- `react-datepicker` - Date selection
- `react-hot-toast` - Notifications

### Backend
- `spring-boot-starter-webmvc` - Spring Web framework
- `mysql-connector-j` - MySQL driver
- `gson` - JSON processing

---

---

## ⚡ Quick Reference - Command Cheat Sheet

For experienced users who just need the commands:

```bash
# 1. Database Setup (one-time)
mysql -u root -p < database/schema.sql

# 2. Start RMI Server (Terminal 1)
cd rmi-server
.\START_RMI_SERVER.ps1
# Or: .\mvnw.cmd exec:java (if Maven Wrapper exists)
# Or: mvn exec:java -Dexec.mainClass="com.distributed.rmi.server.RMIServer"

# 3. Start Spring API (Terminal 2)
cd spring-api
.\START_SPRING_API.ps1
# Or: .\mvnw.cmd spring-boot:run

# 4. Start Frontend (Terminal 3)
npm install  # First time only
npm run dev
```

**Ports:**
- RMI Server: `1099`
- Spring API: `8080`
- Frontend: `5173`

---

This documentation provides a comprehensive overview of the car rental system architecture, file organization, and technology stack.

