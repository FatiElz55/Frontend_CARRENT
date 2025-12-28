package com.distributed.rmi.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Long id;
    private String fullName;
    private String email;
    private String password;
    private String role; // "client" or "owner"
    private String phoneCountryCode;
    private String phoneNumber;
    private String address;
    private String profilePictureUrl;
    private String drivingCardUrl;
    private String nationalCardUrl;
    private Boolean isCompany;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    
    public User() {
    }
    
    public User(String fullName, String email, String password, String role) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getPhoneCountryCode() {
        return phoneCountryCode;
    }
    
    public void setPhoneCountryCode(String phoneCountryCode) {
        this.phoneCountryCode = phoneCountryCode;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }
    
    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
    
    public String getDrivingCardUrl() {
        return drivingCardUrl;
    }
    
    public void setDrivingCardUrl(String drivingCardUrl) {
        this.drivingCardUrl = drivingCardUrl;
    }
    
    public String getNationalCardUrl() {
        return nationalCardUrl;
    }
    
    public void setNationalCardUrl(String nationalCardUrl) {
        this.nationalCardUrl = nationalCardUrl;
    }
    
    public Boolean getIsCompany() {
        return isCompany;
    }
    
    public void setIsCompany(Boolean isCompany) {
        this.isCompany = isCompany;
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
        return "User{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
