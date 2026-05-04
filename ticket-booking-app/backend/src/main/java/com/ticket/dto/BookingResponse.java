package com.ticket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {
    private Long id;
    private String bookingId;
    private String name;
    private String email;
    private String department;
    private Integer numberOfTickets;
    private Double totalAmount;
    private String eventName;
    private String venue;
    private String eventDate;
    private String eventTime;
    private String message;
}
