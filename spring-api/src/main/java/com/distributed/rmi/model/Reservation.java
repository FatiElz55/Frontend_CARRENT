package com.distributed.rmi.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class Reservation implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Long id;
    private Long userId;
    private Long carId;
    private Date startDate;
    private Date endDate;
    private Integer days;
    private String insuranceType; // "basic", "premium", "full"
    private List<String> extras; // List of extras like "gps", "wifi", "babySeat", "delivery"
    private BigDecimal totalPrice;
    private String status; // "pending", "confirmed", "cancelled", "completed"
    private Timestamp createdAt;
    private Timestamp updatedAt;
    
    // Additional fields for display (not persisted, populated from joins)
    private String userName;
    private String carName;
    
    public Reservation() {
        this.extras = new ArrayList<>();
        this.status = "pending";
    }
    
    public Reservation(Long userId, Long carId, Date startDate, Date endDate) {
        this.userId = userId;
        this.carId = carId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.extras = new ArrayList<>();
        this.status = "pending";
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public Long getCarId() {
        return carId;
    }
    
    public void setCarId(Long carId) {
        this.carId = carId;
    }
    
    public Date getStartDate() {
        return startDate;
    }
    
    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }
    
    public Date getEndDate() {
        return endDate;
    }
    
    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }
    
    public Integer getDays() {
        return days;
    }
    
    public void setDays(Integer days) {
        this.days = days;
    }
    
    public String getInsuranceType() {
        return insuranceType;
    }
    
    public void setInsuranceType(String insuranceType) {
        this.insuranceType = insuranceType;
    }
    
    public List<String> getExtras() {
        return extras;
    }
    
    public void setExtras(List<String> extras) {
        this.extras = extras;
    }
    
    public BigDecimal getTotalPrice() {
        return totalPrice;
    }
    
    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
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
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public String getCarName() {
        return carName;
    }
    
    public void setCarName(String carName) {
        this.carName = carName;
    }
    
    @Override
    public String toString() {
        return "Reservation{" +
                "id=" + id +
                ", userId=" + userId +
                ", carId=" + carId +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", status='" + status + '\'' +
                ", totalPrice=" + totalPrice +
                '}';
    }
}
