package com.distributed.rmi.dao;

import com.distributed.rmi.model.User;
import com.distributed.rmi.util.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {
    
    public User create(User user) throws SQLException {
        String sql = "INSERT INTO users (full_name, email, password, role, phone_country_code, phone_number, " +
                     "address, profile_picture_url, driving_card_url, national_card_url, is_company) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setString(1, user.getFullName());
            stmt.setString(2, user.getEmail());
            stmt.setString(3, user.getPassword());
            stmt.setString(4, user.getRole());
            stmt.setString(5, user.getPhoneCountryCode());
            stmt.setString(6, user.getPhoneNumber());
            stmt.setString(7, user.getAddress());
            stmt.setString(8, user.getProfilePictureUrl());
            stmt.setString(9, user.getDrivingCardUrl());
            stmt.setString(10, user.getNationalCardUrl());
            stmt.setBoolean(11, user.getIsCompany() != null ? user.getIsCompany() : false);
            
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating user failed, no rows affected.");
            }
            
            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    user.setId(generatedKeys.getLong(1));
                }
            }
            
            return findById(user.getId());
        }
    }
    
    public User findById(Long id) throws SQLException {
        String sql = "SELECT * FROM users WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    try {
                        return mapRowToUser(rs);
                    } catch (Exception e) {
                        System.err.println("Error mapping user row with id " + id + ": " + e.getMessage());
                        e.printStackTrace();
                        throw new SQLException("Error mapping user: " + e.getMessage(), e);
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println("SQL Error in findById for user " + id + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
        return null;
    }
    
    public User findByEmail(String email) throws SQLException {
        String sql = "SELECT * FROM users WHERE email = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, email);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRowToUser(rs);
                }
            }
        }
        return null;
    }
    
    public User update(User user) throws SQLException {
        // Get existing user to preserve password if not provided
        User existingUser = findById(user.getId());
        if (existingUser == null) {
            throw new SQLException("User not found with id: " + user.getId());
        }
        
        String sql = "UPDATE users SET full_name = ?, email = ?, password = ?, role = ?, " +
                     "phone_country_code = ?, phone_number = ?, address = ?, " +
                     "profile_picture_url = ?, driving_card_url = ?, national_card_url = ?, " +
                     "is_company = ? WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, user.getFullName() != null ? user.getFullName() : existingUser.getFullName());
            stmt.setString(2, user.getEmail() != null ? user.getEmail() : existingUser.getEmail());
            // Only update password if provided, otherwise keep existing password
            stmt.setString(3, user.getPassword() != null && !user.getPassword().isEmpty() ? user.getPassword() : existingUser.getPassword());
            stmt.setString(4, user.getRole() != null ? user.getRole() : existingUser.getRole());
            stmt.setString(5, user.getPhoneCountryCode() != null ? user.getPhoneCountryCode() : existingUser.getPhoneCountryCode());
            stmt.setString(6, user.getPhoneNumber() != null ? user.getPhoneNumber() : existingUser.getPhoneNumber());
            stmt.setString(7, user.getAddress() != null ? user.getAddress() : existingUser.getAddress());
            stmt.setString(8, user.getProfilePictureUrl() != null ? user.getProfilePictureUrl() : existingUser.getProfilePictureUrl());
            stmt.setString(9, user.getDrivingCardUrl() != null ? user.getDrivingCardUrl() : existingUser.getDrivingCardUrl());
            stmt.setString(10, user.getNationalCardUrl() != null ? user.getNationalCardUrl() : existingUser.getNationalCardUrl());
            stmt.setBoolean(11, user.getIsCompany() != null ? user.getIsCompany() : existingUser.getIsCompany());
            stmt.setLong(12, user.getId());
            
            stmt.executeUpdate();
            return findById(user.getId());
        }
    }
    
    public List<User> findAll() throws SQLException {
        String sql = "SELECT * FROM users ORDER BY id";
        List<User> users = new ArrayList<>();
        
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                users.add(mapRowToUser(rs));
            }
        }
        return users;
    }
    
    private User mapRowToUser(ResultSet rs) throws SQLException {
        try {
            User user = new User();
            
            // Get all fields with proper null handling
            Long userId = rs.getLong("id");
            if (!rs.wasNull()) {
                user.setId(userId);
            }
            
            user.setFullName(rs.getString("full_name"));
            user.setEmail(rs.getString("email"));
            user.setPassword(rs.getString("password"));
            user.setRole(rs.getString("role"));
            user.setPhoneCountryCode(rs.getString("phone_country_code"));
            user.setPhoneNumber(rs.getString("phone_number"));
            user.setAddress(rs.getString("address"));
            user.setProfilePictureUrl(rs.getString("profile_picture_url"));
            user.setDrivingCardUrl(rs.getString("driving_card_url"));
            user.setNationalCardUrl(rs.getString("national_card_url"));
            
            // Handle nullable boolean - use getObject to properly detect NULL
            Object isCompanyObj = rs.getObject("is_company");
            if (isCompanyObj == null) {
                user.setIsCompany(false);
            } else if (isCompanyObj instanceof Boolean) {
                user.setIsCompany((Boolean) isCompanyObj);
            } else if (isCompanyObj instanceof Number) {
                // Handle numeric values (0 = false, non-zero = true)
                user.setIsCompany(((Number) isCompanyObj).intValue() != 0);
            } else {
                // Try to parse as boolean string
                try {
                    user.setIsCompany(Boolean.parseBoolean(isCompanyObj.toString()));
                } catch (Exception e) {
                    user.setIsCompany(false);
                }
            }
            
            user.setCreatedAt(rs.getTimestamp("created_at"));
            user.setUpdatedAt(rs.getTimestamp("updated_at"));
            
            return user;
        } catch (SQLException e) {
            System.err.println("SQL Error in mapRowToUser: " + e.getMessage());
            System.err.println("SQL State: " + e.getSQLState());
            System.err.println("Error Code: " + e.getErrorCode());
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            System.err.println("Unexpected error in mapRowToUser: " + e.getMessage());
            e.printStackTrace();
            throw new SQLException("Error mapping user row: " + e.getMessage(), e);
        }
    }
}

