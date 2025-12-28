package com.distributed.spring_api.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

public class Reservation implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Long id;
    private Long userId;
    private Long carId;
    private Date startDate;
    private Date endDate;
    private Integer days;
    private String insuranceType;
    private List<String> extras;
    private BigDecimal totalPrice;
    private String status;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String userName;
    private String carName;
    
    public Reservation() {
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
}

