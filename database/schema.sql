-- Car Rental Database Schema
-- Database: car_rental_db

CREATE DATABASE IF NOT EXISTS car_rental_db;
USE car_rental_db;

-- Users table (clients and owners)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'owner') NOT NULL,
    phone_country_code VARCHAR(10),
    phone_number VARCHAR(20),
    address TEXT,
    profile_picture_url TEXT,
    driving_card_url TEXT,
    national_card_url TEXT,
    is_company BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    city VARCHAR(100) NOT NULL,
    availability ENUM('available', 'reserved', 'maintenance') DEFAULT 'available',
    owner_id BIGINT NOT NULL,
    owner_name VARCHAR(255),
    main_image_url TEXT,
    images_url TEXT, -- JSON array stored as TEXT
    seats INT NOT NULL,
    fuel_type ENUM('Gasoline', 'Diesel', 'Electric', 'Hybrid') NOT NULL,
    gearbox ENUM('Manual', 'Automatic') NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    car_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INT NOT NULL,
    insurance_type ENUM('basic', 'premium', 'full') DEFAULT 'basic',
    extras TEXT, -- JSON array stored as TEXT
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_cars_availability ON cars(availability);
CREATE INDEX idx_cars_city ON cars(city);
CREATE INDEX idx_cars_brand ON cars(brand);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_car_id ON reservations(car_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

