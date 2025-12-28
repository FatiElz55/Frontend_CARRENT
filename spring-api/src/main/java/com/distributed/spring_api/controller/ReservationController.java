package com.distributed.spring_api.controller;

import com.distributed.rmi.model.Reservation;
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
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {
    
    @Autowired
    private RMIClientService rmiClientService;
    
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {
        try {
            Reservation createdReservation = rmiClientService.createReservation(reservation);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReservation);
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error creating reservation", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationById(@PathVariable Long id) {
        try {
            Reservation reservation = rmiClientService.getReservationById(id);
            if (reservation == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(reservation);
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error fetching reservation", e.getMessage()));
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getReservationsByUser(@PathVariable Long userId) {
        try {
            List<Reservation> reservations = rmiClientService.getReservationsByUser(userId);
            return ResponseEntity.ok(reservations);
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error fetching user reservations", e.getMessage()));
        }
    }
    
    @GetMapping("/car/{carId}")
    public ResponseEntity<?> getReservationsByCar(@PathVariable Long carId) {
        try {
            List<Reservation> reservations = rmiClientService.getReservationsByCar(carId);
            return ResponseEntity.ok(reservations);
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error fetching car reservations", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllReservations() {
        try {
            List<Reservation> reservations = rmiClientService.getAllReservations();
            return ResponseEntity.ok(reservations);
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error fetching reservations", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(@PathVariable Long id, @RequestBody Reservation reservation) {
        try {
            reservation.setId(id);
            Reservation updatedReservation = rmiClientService.updateReservation(reservation);
            return ResponseEntity.ok(updatedReservation);
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error updating reservation", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        try {
            boolean cancelled = rmiClientService.cancelReservation(id);
            if (cancelled) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RemoteException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error cancelling reservation", e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String error, String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", error);
        response.put("message", message);
        return response;
    }
}
