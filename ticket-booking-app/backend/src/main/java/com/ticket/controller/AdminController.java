package com.ticket.controller;

import com.ticket.model.Booking;
import com.ticket.model.Event;
import com.ticket.repository.BookingRepository;
import com.ticket.repository.EventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;

    public AdminController(EventRepository eventRepository, BookingRepository bookingRepository) {
        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        List<Booking> bookings = bookingRepository.findAll();
        double revenue = bookings.stream().mapToDouble(Booking::getTotalAmount).sum();
        int ticketsBooked = bookings.stream().mapToInt(Booking::getNumberOfTickets).sum();
        Map<String, Object> map = new HashMap<>();
        map.put("totalEvents", eventRepository.count());
        map.put("totalBookings", bookings.size());
        map.put("ticketsBooked", ticketsBooked);
        map.put("revenue", revenue);
        map.put("bookings", bookings);
        return ResponseEntity.ok(map);
    }

    @PostMapping("/events")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        if (event.getAvailableTickets() == null) event.setAvailableTickets(event.getTotalTickets());
        return ResponseEntity.ok(eventRepository.save(event));
    }
}
