package com.distributed.spring_api.controller;

import com.distributed.rmi.model.User;
import com.distributed.spring_api.service.RMIClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.rmi.RemoteException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private RMIClientService rmiClientService;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = rmiClientService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (RemoteException e) {
            e.printStackTrace(); // Log the full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Registration failed", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace(); // Log any other exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Registration failed", e.getMessage()));
        }
    }
    
    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            
            if (email == null || password == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Validation error", "Email and password are required"));
            }
            
            User user = rmiClientService.authenticateUser(email, password);
            return ResponseEntity.ok(user);
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Authentication failed", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            if (id == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Validation error", "User ID cannot be null"));
            }
            User user = rmiClientService.getUserById(id);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Not found", "User not found with id: " + id));
            }
            return ResponseEntity.ok(user);
        } catch (RemoteException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error fetching user", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Unexpected error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            user.setId(id);
            User updatedUser = rmiClientService.updateUser(user);
            return ResponseEntity.ok(updatedUser);
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error updating user", e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordData) {
        try {
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");
            
            if (currentPassword == null || newPassword == null) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Validation error", "Current password and new password are required"));
            }
            
            boolean success = rmiClientService.changePassword(id, currentPassword, newPassword);
            if (success) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Password changed successfully");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(createErrorResponse("Error", "Failed to change password"));
            }
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("Error changing password", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = rmiClientService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error fetching users", e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String error, String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", error);
        response.put("message", message);
        return response;
    }
}
