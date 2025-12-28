package com.distributed.rmi.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class Car implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Long id;
    private String name;
    private String brand;
    private BigDecimal pricePerDay;
    private String city;
    private String availability; // "available", "reserved", "maintenance"
    private Long ownerId;
    private String ownerName;
    private String mainImageUrl;
    private List<String> imagesUrl;
    private Integer seats;
    private String fuelType; // "Gasoline", "Diesel", "Electric", "Hybrid"
    private String gearbox; // "Manual", "Automatic"
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    
    public Car() {
        this.imagesUrl = new ArrayList<>();
    }
    
    public Car(String name, String brand, BigDecimal pricePerDay, String city) {
        this.name = name;
        this.brand = brand;
        this.pricePerDay = pricePerDay;
        this.city = city;
        this.availability = "available";
        this.imagesUrl = new ArrayList<>();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getBrand() {
        return brand;
    }
    
    public void setBrand(String brand) {
        this.brand = brand;
    }
    
    public BigDecimal getPricePerDay() {
        return pricePerDay;
    }
    
    public void setPricePerDay(BigDecimal pricePerDay) {
        this.pricePerDay = pricePerDay;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getAvailability() {
        return availability;
    }
    
    public void setAvailability(String availability) {
        this.availability = availability;
    }
    
    public Long getOwnerId() {
        return ownerId;
    }
    
    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }
    
    public String getOwnerName() {
        return ownerName;
    }
    
    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }
    
    public String getMainImageUrl() {
        return mainImageUrl;
    }
    
    public void setMainImageUrl(String mainImageUrl) {
        this.mainImageUrl = mainImageUrl;
    }
    
    public List<String> getImagesUrl() {
        return imagesUrl;
    }
    
    public void setImagesUrl(List<String> imagesUrl) {
        this.imagesUrl = imagesUrl;
    }
    
    public Integer getSeats() {
        return seats;
    }
    
    public void setSeats(Integer seats) {
        this.seats = seats;
    }
    
    public String getFuelType() {
        return fuelType;
    }
    
    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }
    
    public String getGearbox() {
        return gearbox;
    }
    
    public void setGearbox(String gearbox) {
        this.gearbox = gearbox;
    }
    
    public BigDecimal getLatitude() {
        return latitude;
    }
    
    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }
    
    public BigDecimal getLongitude() {
        return longitude;
    }
    
    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }
    
    public Timestamp getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
    
    public Timestamp getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @Override
    public String toString() {
        return "Car{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", brand='" + brand + '\'' +
                ", pricePerDay=" + pricePerDay +
                ", city='" + city + '\'' +
                ", availability='" + availability + '\'' +
                '}';
    }
}

