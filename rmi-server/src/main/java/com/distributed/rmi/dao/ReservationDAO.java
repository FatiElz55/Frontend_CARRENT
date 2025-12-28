package com.distributed.rmi.dao;

import com.distributed.rmi.model.Reservation;
import com.distributed.rmi.util.DatabaseConnection;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ReservationDAO {
    private static final Gson gson = new Gson();
    
    public Reservation create(Reservation reservation) throws SQLException {
        String sql = "INSERT INTO reservations (user_id, car_id, start_date, end_date, days, " +
                     "insurance_type, extras, total_price, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setLong(1, reservation.getUserId());
            stmt.setLong(2, reservation.getCarId());
            stmt.setDate(3, reservation.getStartDate());
            stmt.setDate(4, reservation.getEndDate());
            stmt.setInt(5, reservation.getDays());
            stmt.setString(6, reservation.getInsuranceType());
            stmt.setString(7, gson.toJson(reservation.getExtras()));
            stmt.setBigDecimal(8, reservation.getTotalPrice());
            stmt.setString(9, reservation.getStatus());
            
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating reservation failed, no rows affected.");
            }
            
            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    reservation.setId(generatedKeys.getLong(1));
                }
            }
            
            return findById(reservation.getId());
        }
    }
    
    public Reservation findById(Long id) throws SQLException {
        String sql = "SELECT r.*, u.full_name as user_name, c.name as car_name " +
                     "FROM reservations r " +
                     "LEFT JOIN users u ON r.user_id = u.id " +
                     "LEFT JOIN cars c ON r.car_id = c.id " +
                     "WHERE r.id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRowToReservation(rs);
                }
            }
        }
        return null;
    }
    
    public List<Reservation> findAll() throws SQLException {
        String sql = "SELECT r.*, u.full_name as user_name, c.name as car_name " +
                     "FROM reservations r " +
                     "LEFT JOIN users u ON r.user_id = u.id " +
                     "LEFT JOIN cars c ON r.car_id = c.id " +
                     "ORDER BY r.id";
        List<Reservation> reservations = new ArrayList<>();
        
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                reservations.add(mapRowToReservation(rs));
            }
        }
        return reservations;
    }
    
    public List<Reservation> findByUserId(Long userId) throws SQLException {
        String sql = "SELECT r.*, u.full_name as user_name, c.name as car_name " +
                     "FROM reservations r " +
                     "LEFT JOIN users u ON r.user_id = u.id " +
                     "LEFT JOIN cars c ON r.car_id = c.id " +
                     "WHERE r.user_id = ? ORDER BY r.id";
        List<Reservation> reservations = new ArrayList<>();
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, userId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    reservations.add(mapRowToReservation(rs));
                }
            }
        }
        return reservations;
    }
    
    public List<Reservation> findByCarId(Long carId) throws SQLException {
        String sql = "SELECT r.*, u.full_name as user_name, c.name as car_name " +
                     "FROM reservations r " +
                     "LEFT JOIN users u ON r.user_id = u.id " +
                     "LEFT JOIN cars c ON r.car_id = c.id " +
                     "WHERE r.car_id = ? ORDER BY r.id";
        List<Reservation> reservations = new ArrayList<>();
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, carId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    reservations.add(mapRowToReservation(rs));
                }
            }
        }
        return reservations;
    }
    
    public Reservation update(Reservation reservation) throws SQLException {
        String sql = "UPDATE reservations SET user_id = ?, car_id = ?, start_date = ?, " +
                     "end_date = ?, days = ?, insurance_type = ?, extras = ?, " +
                     "total_price = ?, status = ? WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, reservation.getUserId());
            stmt.setLong(2, reservation.getCarId());
            stmt.setDate(3, reservation.getStartDate());
            stmt.setDate(4, reservation.getEndDate());
            stmt.setInt(5, reservation.getDays());
            stmt.setString(6, reservation.getInsuranceType());
            stmt.setString(7, gson.toJson(reservation.getExtras()));
            stmt.setBigDecimal(8, reservation.getTotalPrice());
            stmt.setString(9, reservation.getStatus());
            stmt.setLong(10, reservation.getId());
            
            stmt.executeUpdate();
            return findById(reservation.getId());
        }
    }
    
    public boolean cancel(Long id) throws SQLException {
        String sql = "UPDATE reservations SET status = 'cancelled' WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, id);
            return stmt.executeUpdate() > 0;
        }
    }
    
    /**
     * Check if a car has active reservations that overlap with today's date
     * Active means status is 'pending' or 'confirmed' (not 'cancelled' or 'completed')
     */
    public boolean hasActiveReservationForToday(Long carId) throws SQLException {
        String sql = "SELECT COUNT(*) as count FROM reservations " +
                     "WHERE car_id = ? " +
                     "AND status IN ('pending', 'confirmed') " +
                     "AND CURDATE() >= start_date " +
                     "AND CURDATE() <= end_date";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, carId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("count") > 0;
                }
            }
        }
        return false;
    }
    
    /**
     * Check if a car has active reservations that overlap with a specific date range
     * Includes both pending and confirmed reservations
     */
    public boolean hasActiveReservationOverlap(Long carId, Date startDate, Date endDate) throws SQLException {
        String sql = "SELECT COUNT(*) as count FROM reservations " +
                     "WHERE car_id = ? " +
                     "AND status IN ('pending', 'confirmed') " +
                     "AND ((start_date <= ? AND end_date >= ?) OR " +
                     "     (start_date <= ? AND end_date >= ?) OR " +
                     "     (start_date >= ? AND end_date <= ?))";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, carId);
            stmt.setDate(2, endDate);   // overlap check: new start <= existing end
            stmt.setDate(3, startDate); // overlap check: new start <= existing end
            stmt.setDate(4, endDate);   // overlap check: new end >= existing start
            stmt.setDate(5, startDate); // overlap check: new end >= existing start
            stmt.setDate(6, startDate); // overlap check: new range contains existing
            stmt.setDate(7, endDate);   // overlap check: new range contains existing
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("count") > 0;
                }
            }
        }
        return false;
    }
    
    /**
     * Check if a car has CONFIRMED reservations that overlap with a specific date range
     * Only confirmed reservations block new bookings (pending ones don't)
     */
    public boolean hasConfirmedReservationOverlap(Long carId, Date startDate, Date endDate) throws SQLException {
        String sql = "SELECT COUNT(*) as count FROM reservations " +
                     "WHERE car_id = ? " +
                     "AND status = 'confirmed' " +
                     "AND ((start_date <= ? AND end_date >= ?) OR " +
                     "     (start_date <= ? AND end_date >= ?) OR " +
                     "     (start_date >= ? AND end_date <= ?))";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, carId);
            stmt.setDate(2, endDate);   // overlap check: new start <= existing end
            stmt.setDate(3, startDate); // overlap check: new start <= existing end
            stmt.setDate(4, endDate);   // overlap check: new end >= existing start
            stmt.setDate(5, startDate); // overlap check: new end >= existing start
            stmt.setDate(6, startDate); // overlap check: new range contains existing
            stmt.setDate(7, endDate);   // overlap check: new range contains existing
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("count") > 0;
                }
            }
        }
        return false;
    }
    
    private Reservation mapRowToReservation(ResultSet rs) throws SQLException {
        Reservation reservation = new Reservation();
        reservation.setId(rs.getLong("id"));
        reservation.setUserId(rs.getLong("user_id"));
        reservation.setCarId(rs.getLong("car_id"));
        reservation.setStartDate(rs.getDate("start_date"));
        reservation.setEndDate(rs.getDate("end_date"));
        reservation.setDays(rs.getInt("days"));
        reservation.setInsuranceType(rs.getString("insurance_type"));
        
        // Parse JSON extras array
        String extrasJson = rs.getString("extras");
        if (extrasJson != null && !extrasJson.isEmpty()) {
            Type listType = new TypeToken<List<String>>(){}.getType();
            reservation.setExtras(gson.fromJson(extrasJson, listType));
        }
        
        reservation.setTotalPrice(rs.getBigDecimal("total_price"));
        reservation.setStatus(rs.getString("status"));
        reservation.setCreatedAt(rs.getTimestamp("created_at"));
        reservation.setUpdatedAt(rs.getTimestamp("updated_at"));
        
        // Additional fields from joins
        reservation.setUserName(rs.getString("user_name"));
        reservation.setCarName(rs.getString("car_name"));
        
        return reservation;
    }
}

