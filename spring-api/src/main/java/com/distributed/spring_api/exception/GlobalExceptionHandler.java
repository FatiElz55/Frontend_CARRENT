package com.distributed.spring_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.rmi.RemoteException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RemoteException.class)
    public ResponseEntity<Map<String, String>> handleRemoteException(RemoteException e) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "RMI Remote Exception");
        errorResponse.put("message", e.getMessage());
        errorResponse.put("type", "REMOTE_EXCEPTION");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Runtime Exception");
        errorResponse.put("message", e.getMessage());
        errorResponse.put("type", "RUNTIME_EXCEPTION");
        
        // Check if it's an RMI connection error
        if (e.getMessage() != null && e.getMessage().contains("RMI")) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse);
        }
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception e) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Internal Server Error");
        errorResponse.put("message", e.getMessage());
        errorResponse.put("type", "GENERIC_EXCEPTION");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}

