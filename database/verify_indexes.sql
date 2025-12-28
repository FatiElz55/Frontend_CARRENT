-- Verify database structure and indexes
USE car_rental_db;

-- Show all tables
SHOW TABLES;

-- Show indexes on cars table
SHOW INDEXES FROM cars;

-- Show indexes on reservations table
SHOW INDEXES FROM reservations;

-- Show indexes on users table
SHOW INDEXES FROM users;

-- Show table structure
DESCRIBE users;
DESCRIBE cars;
DESCRIBE reservations;

