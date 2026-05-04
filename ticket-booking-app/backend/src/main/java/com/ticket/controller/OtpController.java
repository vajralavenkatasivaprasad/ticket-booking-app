package com.ticket.controller;

import com.ticket.service.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
@Tag(name = "OTP", description = "OTP verification APIs")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/send")
    @Operation(summary = "Send OTP to email")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> body) {
        try {
            otpService.generateAndSendOtp(body.get("email"));
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully to " + body.get("email")));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Failed to send OTP: " + e.getMessage()));
        }
    }

    @PostMapping("/resend")
    @Operation(summary = "Resend OTP")
    public ResponseEntity<Map<String, String>> resendOtp(@RequestBody Map<String, String> body) {
        try {
            otpService.generateAndSendOtp(body.get("email"));
            return ResponseEntity.ok(Map.of("message", "OTP resent successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Failed to resend OTP"));
        }
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify OTP")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody Map<String, String> body) {
        boolean valid = otpService.verifyOtp(body.get("email"), body.get("otp"));
        if (valid) {
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid or expired OTP"));
        }
    }
}
