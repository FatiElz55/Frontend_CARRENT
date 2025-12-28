package com.distributed.rmi.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DatabaseConnection {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/car_rental_db";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = ""; // XAMPP default empty password
    
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("MySQL JDBC Driver not found", e);
        }
    }
    
    public static Connection getConnection() throws SQLException {
        Properties props = new Properties();
        props.setProperty("user", DB_USER);
        props.setProperty("password", DB_PASSWORD);
        props.setProperty("useSSL", "false");
        props.setProperty("serverTimezone", "UTC");
        props.setProperty("allowPublicKeyRetrieval", "true");
        
        return DriverManager.getConnection(DB_URL, props);
    }
}

