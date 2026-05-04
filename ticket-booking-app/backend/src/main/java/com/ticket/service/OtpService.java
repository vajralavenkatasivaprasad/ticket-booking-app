package com.ticket.service;

import com.ticket.model.OtpRecord;
import com.ticket.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Value("${otp.expiry.minutes:5}")
    private int expiryMinutes;

    private final SecureRandom random = new SecureRandom();

    public void generateAndSendOtp(String email) {
        // Delete any existing OTP for this email
        otpRepository.deleteByEmail(email);

        // Generate 6-digit OTP
        String otp = String.format("%06d", random.nextInt(1000000));

        // Save to DB
        OtpRecord record = new OtpRecord();
        record.setEmail(email);
        record.setOtp(otp);
        record.setExpiresAt(LocalDateTime.now().plusMinutes(expiryMinutes));
        record.setVerified(false);
        otpRepository.save(record);

        // Send email if SMTP is configured; otherwise log OTP for local testing
        try {
            emailService.sendOtpEmail(email, otp, expiryMinutes);
        } catch (Exception e) {
            System.out.println("DEV OTP for " + email + ": " + otp + " (email not configured: " + e.getMessage() + ")");
        }
    }

    public boolean verifyOtp(String email, String otp) {
        Optional<OtpRecord> recordOpt = otpRepository.findTopByEmailOrderByExpiresAtDesc(email);
        if (recordOpt.isEmpty()) return false;

        OtpRecord record = recordOpt.get();
        if (record.isVerified()) return false;
        if (record.getExpiresAt().isBefore(LocalDateTime.now())) return false;
        if (!record.getOtp().equals(otp)) return false;

        record.setVerified(true);
        otpRepository.save(record);
        return true;
    }

    // Clean up expired OTPs every 30 minutes
    @Scheduled(fixedRate = 1800000)
    public void cleanExpiredOtps() {
        otpRepository.deleteExpiredRecords(LocalDateTime.now());
    }
}
