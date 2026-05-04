package com.ticket.service;

import com.ticket.dto.BookingRequest;
import com.ticket.dto.BookingResponse;
import com.ticket.model.Booking;
import com.ticket.model.Event;
import com.ticket.repository.BookingRepository;
import com.ticket.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getAvailableTickets() < request.getNumberOfTickets()) {
            throw new RuntimeException("Only " + event.getAvailableTickets() + " tickets available");
        }

        // Deduct tickets
        event.setAvailableTickets(event.getAvailableTickets() - request.getNumberOfTickets());
        eventRepository.save(event);

        // Create booking
        Booking booking = new Booking();
        booking.setEvent(event);
        booking.setName(request.getName());
        booking.setEmail(request.getEmail());
        booking.setDepartment(request.getDepartment());
        booking.setNumberOfTickets(request.getNumberOfTickets());
        booking.setTotalAmount(request.getNumberOfTickets() * event.getTicketPrice());
        Booking saved = bookingRepository.save(booking);

        // Send confirmation email
        try {
            emailService.sendBookingConfirmationEmail(
                    saved.getEmail(), saved.getName(), saved.getBookingId(),
                    event.getEventName(), event.getVenue(),
                    saved.getNumberOfTickets(), saved.getTotalAmount()
            );
        } catch (Exception e) {
            // Don't fail the booking if email fails
            System.err.println("Email notification failed: " + e.getMessage());
        }

        return toResponse(saved, event);
    }

    public java.util.List<BookingResponse> getBookingsByEmail(String email) {
        return bookingRepository.findByEmail(email).stream()
                .map(b -> toResponse(b, b.getEvent()))
                .toList();
    }

    private BookingResponse toResponse(Booking b, Event e) {
        BookingResponse res = new BookingResponse();
        res.setId(b.getId());
        res.setBookingId(b.getBookingId());
        res.setName(b.getName());
        res.setEmail(b.getEmail());
        res.setDepartment(b.getDepartment());
        res.setNumberOfTickets(b.getNumberOfTickets());
        res.setTotalAmount(b.getTotalAmount());
        res.setEventName(e.getEventName());
        res.setVenue(e.getVenue());
        res.setEventDate(e.getEventDate().toString());
        res.setEventTime(e.getEventTime().toString());
        res.setMessage("Booking confirmed! Confirmation sent to " + b.getEmail());
        return res;
    }
}
