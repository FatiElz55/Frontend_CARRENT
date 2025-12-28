# Car Rental System - RMI Distributed Setup Instructions

## Prerequisites
1. Java 21 or higher
2. Maven 3.6+
3. XAMPP (MySQL database)
4. MySQL running on port 3306 (XAMPP default)

## Database Setup

1. Start XAMPP and ensure MySQL is running
2. Execute the database schema:
   ```sql
   mysql -u root -p < database/schema.sql
   ```
   Or manually run the SQL script in `database/schema.sql` using phpMyAdmin or MySQL Workbench

## RMI Server Setup

1. Navigate to the RMI server directory:
   ```powershell
   cd rmi-server
   ```

2. Build the project:
   ```powershell
   mvnd clean install
   ```
   Or if you have standard Maven:
   ```powershell
   mvn clean install
   ```

3. Run the RMI server:
   ```powershell
   mvnd exec:java -Dexec.mainClass="com.distributed.rmi.server.RMIServer"
   ```
   Or if you have standard Maven:
   ```powershell
   mvn exec:java -Dexec.mainClass="com.distributed.rmi.server.RMIServer"
   ```
   Or run the compiled JAR:
   ```powershell
   java -cp target/rmi-server-1.0-SNAPSHOT.jar com.distributed.rmi.server.RMIServer
   ```

   The RMI server will start on port 1099 and bind the service as "CarRentalService"
   
   **Note:** Keep this terminal window open. The RMI server must remain running.

## Spring Boot API Setup

1. Open a NEW PowerShell terminal (keep RMI server running in the first terminal)

2. Navigate to the Spring Boot API directory:
   ```powershell
   cd spring-api
   ```

3. Run the Spring Boot application (using Maven wrapper):
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   Or if you have Maven installed:
   ```powershell
   mvnd spring-boot:run
   ```
   Or:
   ```powershell
   mvn spring-boot:run
   ```

   The API will start on port 8080
   
   **Note:** You should see "Connected to RMI server at localhost:1099" in the output

## Architecture

- **Frontend**: React application (existing in `src/`)
- **Spring Boot API**: REST API running on port 8080 (acts as RMI client)
- **RMI Server**: Business logic server running on port 1099
- **MySQL Database**: XAMPP MySQL on port 3306

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/authenticate` - Authenticate user
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `GET /api/users` - Get all users

### Cars
- `GET /api/cars` - Get all cars (supports ?brand=&city=&availability= query params)
- `GET /api/cars/{id}` - Get car by ID
- `POST /api/cars` - Add a new car
- `PUT /api/cars/{id}` - Update car
- `DELETE /api/cars/{id}` - Delete car
- `GET /api/cars/owner/{ownerId}` - Get cars by owner

### Reservations
- `POST /api/reservations` - Create a reservation
- `GET /api/reservations/{id}` - Get reservation by ID
- `GET /api/reservations/user/{userId}` - Get reservations by user
- `GET /api/reservations/car/{carId}` - Get reservations by car
- `PUT /api/reservations/{id}` - Update reservation
- `DELETE /api/reservations/{id}` - Cancel reservation
- `GET /api/reservations` - Get all reservations

## Running Order

1. **Start MySQL (XAMPP)** - Ensure MySQL is running in XAMPP Control Panel

2. **Run RMI Server** (must be running before Spring Boot):
   ```powershell
   cd C:\Users\elzfa\Desktop\Frontend_CARRENT\rmi-server
   mvnd clean install
   mvnd exec:java -Dexec.mainClass="com.distributed.rmi.server.RMIServer"
   ```
   Keep this terminal window open!

3. **Run Spring Boot API** (in a NEW PowerShell terminal):
   ```powershell
   cd C:\Users\elzfa\Desktop\Frontend_CARRENT\spring-api
   .\mvnw.cmd spring-boot:run
   ```
   Wait for "Started SpringApiApplication" message

4. **Run Frontend** (in another terminal if needed):
   ```powershell
   cd C:\Users\elzfa\Desktop\Frontend_CARRENT
   npm run dev
   ```

## Troubleshooting

- **RMI Connection Error**: Ensure RMI server is running before starting Spring Boot
- **Database Connection Error**: Check XAMPP MySQL is running and database `car_rental_db` exists
- **Port Already in Use**: Change ports in `application.properties` (Spring Boot) or `RMIServer.java` (RMI)
