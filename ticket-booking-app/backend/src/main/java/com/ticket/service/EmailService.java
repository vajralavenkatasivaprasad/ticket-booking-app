package com.ticket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp, int expiryMinutes) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("🎟 EventPass — Your OTP for Ticket Booking");
            helper.setText(buildOtpEmailHtml(otp, expiryMinutes), true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }

    public void sendBookingConfirmationEmail(String to, String name, String bookingId,
                                             String eventName, String venue,
                                             int tickets, double total) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("✅ EventPass — Booking Confirmed: " + eventName);
            helper.setText(buildConfirmationHtml(name, bookingId, eventName, venue, tickets, total), true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send confirmation email: " + e.getMessage());
        }
    }

    private String buildOtpEmailHtml(String otp, int expiryMinutes) {
        return """
            <div style="font-family:sans-serif;max-width:500px;margin:auto;background:#0d0d1a;color:#f0f0ff;padding:2rem;border-radius:16px;">
                <h2 style="color:#6c63ff;">🎟 EventPass</h2>
                <p>Your OTP for ticket booking verification:</p>
                <div style="font-size:2.5rem;letter-spacing:0.5rem;font-weight:bold;color:#43e6b5;text-align:center;padding:1rem;background:#1a1a38;border-radius:12px;margin:1rem 0;">
                    %s
                </div>
                <p style="color:#a0a0c8;font-size:0.9rem;">This OTP expires in <strong>%d minutes</strong>. Do not share it with anyone.</p>
                <hr style="border-color:#1a1a38;margin:1.5rem 0;"/>
                <p style="font-size:0.8rem;color:#666;">If you did not request this, please ignore this email.</p>
            </div>
            """.formatted(otp, expiryMinutes);
    }

    private String buildConfirmationHtml(String name, String bookingId, String eventName,
                                          String venue, int tickets, double total) {
        return """
            <div style="font-family:sans-serif;max-width:500px;margin:auto;background:#0d0d1a;color:#f0f0ff;padding:2rem;border-radius:16px;">
                <h2 style="color:#43e6b5;">✅ Booking Confirmed!</h2>
                <p>Hi <strong>%s</strong>, your tickets are booked!</p>
                <table style="width:100%%;border-collapse:collapse;margin:1rem 0;">
                    <tr><td style="padding:0.5rem;color:#a0a0c8;">Booking ID</td><td style="color:#6c63ff;font-weight:bold;">%s</td></tr>
                    <tr><td style="padding:0.5rem;color:#a0a0c8;">Event</td><td>%s</td></tr>
                    <tr><td style="padding:0.5rem;color:#a0a0c8;">Venue</td><td>%s</td></tr>
                    <tr><td style="padding:0.5rem;color:#a0a0c8;">Tickets</td><td>%d</td></tr>
                    <tr><td style="padding:0.5rem;color:#a0a0c8;">Total</td><td style="color:#43e6b5;font-weight:bold;">₹%.2f</td></tr>
                </table>
                <p style="font-size:0.85rem;color:#a0a0c8;">Please carry your booking ID at the event venue.</p>
            </div>
            """.formatted(name, bookingId, eventName, venue, tickets, total);
    }
}
