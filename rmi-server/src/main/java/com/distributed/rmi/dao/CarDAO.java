package com.distributed.rmi.dao;

import com.distributed.rmi.model.Car;
import com.distributed.rmi.util.DatabaseConnection;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CarDAO {
    private static final Gson gson = new Gson();
    
    public Car create(Car car) throws SQLException {
        String sql = "INSERT INTO cars (name, brand, price_per_day, city, availability, owner_id, " +
                     "owner_name, main_image_url, images_url, seats, fuel_type, gearbox, latitude, longitude) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setString(1, car.getName());
            stmt.setString(2, car.getBrand());
            // Ensure BigDecimal has scale of 2 (for currency)
            BigDecimal price = car.getPricePerDay();
            if (price != null) {
                price = price.setScale(2, java.math.RoundingMode.HALF_UP);
            }
            stmt.setBigDecimal(3, price);
            stmt.setString(4, car.getCity());
            stmt.setString(5, car.getAvailability());
            stmt.setLong(6, car.getOwnerId());
            stmt.setString(7, car.getOwnerName());
            stmt.setString(8, car.getMainImageUrl());
            stmt.setString(9, gson.toJson(car.getImagesUrl()));
            stmt.setInt(10, car.getSeats());
            stmt.setString(11, car.getFuelType());
            stmt.setString(12, car.getGearbox());
            stmt.setBigDecimal(13, car.getLatitude());
            stmt.setBigDecimal(14, car.getLongitude());
            
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating car failed, no rows affected.");
            }
            
            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    car.setId(generatedKeys.getLong(1));
                }
            }
            
            return findById(car.getId());
        }
    }
    
    public Car findById(Long id) throws SQLException {
        String sql = "SELECT * FROM cars WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRowToCar(rs);
                }
            }
        }
        return null;
    }
    
    public List<Car> findAll() throws SQLException {
        String sql = "SELECT * FROM cars ORDER BY id";
        List<Car> cars = new ArrayList<>();
        
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                cars.add(mapRowToCar(rs));
            }
        }
        return cars;
    }
    
    public List<Car> findByOwner(Long ownerId) throws SQLException {
        String sql = "SELECT * FROM cars WHERE owner_id = ? ORDER BY id";
        List<Car> cars = new ArrayList<>();
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, ownerId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    try {
                        cars.add(mapRowToCar(rs));
                    } catch (Exception e) {
                        // Log error but continue processing other cars
                        System.err.println("Error mapping car row: " + e.getMessage());
                        e.printStackTrace();
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println("SQL Error in findByOwner: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
        return cars;
    }
    
    public List<Car> search(String brand, String city, String availability) throws SQLException {
        StringBuilder sql = new StringBuilder("SELECT * FROM cars WHERE 1=1");
        List<Object> params = new ArrayList<>();
        
        if (brand != null && !brand.isEmpty()) {
            sql.append(" AND brand = ?");
            params.add(brand);
        }
        if (city != null && !city.isEmpty()) {
            sql.append(" AND city = ?");
            params.add(city);
        }
        if (availability != null && !availability.isEmpty()) {
            sql.append(" AND availability = ?");
            params.add(availability);
        }
        sql.append(" ORDER BY id");
        
        List<Car> cars = new ArrayList<>();
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
            
            for (int i = 0; i < params.size(); i++) {
                stmt.setObject(i + 1, params.get(i));
            }
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    cars.add(mapRowToCar(rs));
                }
            }
        }
        return cars;
    }
    
    public Car update(Car car) throws SQLException {
        String sql = "UPDATE cars SET name = ?, brand = ?, price_per_day = ?, city = ?, " +
                     "availability = ?, owner_id = ?, owner_name = ?, main_image_url = ?, " +
                     "images_url = ?, seats = ?, fuel_type = ?, gearbox = ?, " +
                     "latitude = ?, longitude = ? WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, car.getName());
            stmt.setString(2, car.getBrand());
            // Ensure BigDecimal has scale of 2 (for currency)
            BigDecimal price = car.getPricePerDay();
            if (price != null) {
                price = price.setScale(2, java.math.RoundingMode.HALF_UP);
            }
            stmt.setBigDecimal(3, price);
            stmt.setString(4, car.getCity());
            stmt.setString(5, car.getAvailability());
            stmt.setLong(6, car.getOwnerId());
            stmt.setString(7, car.getOwnerName());
            stmt.setString(8, car.getMainImageUrl());
            stmt.setString(9, gson.toJson(car.getImagesUrl()));
            stmt.setInt(10, car.getSeats());
            stmt.setString(11, car.getFuelType());
            stmt.setString(12, car.getGearbox());
            stmt.setBigDecimal(13, car.getLatitude());
            stmt.setBigDecimal(14, car.getLongitude());
            stmt.setLong(15, car.getId());
            
            stmt.executeUpdate();
            return findById(car.getId());
        }
    }
    
    public boolean delete(Long id) throws SQLException {
        String sql = "DELETE FROM cars WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, id);
            return stmt.executeUpdate() > 0;
        }
    }
    
    private Car mapRowToCar(ResultSet rs) throws SQLException {
        try {
            Car car = new Car();
            car.setId(rs.getLong("id"));
            car.setName(rs.getString("name"));
            car.setBrand(rs.getString("brand"));
            
            // Ensure BigDecimal has scale of 2 (for currency)
            BigDecimal price = rs.getBigDecimal("price_per_day");
            if (price != null) {
                price = price.setScale(2, java.math.RoundingMode.HALF_UP);
            }
            car.setPricePerDay(price);
            
            car.setCity(rs.getString("city"));
            
            // Use stored availability - dynamic check moved to frontend to prevent performance issues
            String storedAvailability = rs.getString("availability");
            car.setAvailability(storedAvailability != null ? storedAvailability : "available");
            
            car.setOwnerId(rs.getLong("owner_id"));
            car.setOwnerName(rs.getString("owner_name"));
            car.setMainImageUrl(rs.getString("main_image_url"));
            
            // Parse JSON images array - handle null/empty safely
            String imagesJson = rs.getString("images_url");
            if (imagesJson != null && !imagesJson.trim().isEmpty()) {
                try {
                    Type listType = new TypeToken<List<String>>(){}.getType();
                    List<String> images = gson.fromJson(imagesJson, listType);
                    car.setImagesUrl(images != null ? images : new ArrayList<>());
                } catch (Exception e) {
                    // If JSON parsing fails, use empty list
                    System.err.println("Error parsing images JSON: " + imagesJson + " - " + e.getMessage());
                    car.setImagesUrl(new ArrayList<>());
                }
            } else {
                car.setImagesUrl(new ArrayList<>());
            }
            
            car.setSeats(rs.getInt("seats"));
            car.setFuelType(rs.getString("fuel_type"));
            car.setGearbox(rs.getString("gearbox"));
            
            // Handle nullable latitude/longitude
            BigDecimal lat = rs.getBigDecimal("latitude");
            if (rs.wasNull()) lat = null;
            car.setLatitude(lat);
            
            BigDecimal lng = rs.getBigDecimal("longitude");
            if (rs.wasNull()) lng = null;
            car.setLongitude(lng);
            
            car.setCreatedAt(rs.getTimestamp("created_at"));
            car.setUpdatedAt(rs.getTimestamp("updated_at"));
            
            return car;
        } catch (SQLException e) {
            System.err.println("Error in mapRowToCar: " + e.getMessage());
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            System.err.println("Unexpected error in mapRowToCar: " + e.getMessage());
            e.printStackTrace();
            throw new SQLException("Error mapping car row: " + e.getMessage(), e);
        }
    }
}

