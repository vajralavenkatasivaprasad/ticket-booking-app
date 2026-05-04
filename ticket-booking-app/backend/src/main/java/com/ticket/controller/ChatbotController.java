package com.ticket.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/chatbot")
@Tag(name = "Chatbot", description = "AI-powered event chatbot")
public class ChatbotController {

    @Value("${anthropic.api.key:}")
    private String anthropicApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/ask")
    @Operation(summary = "Ask the chatbot a question about the event")
    public ResponseEntity<Map<String, String>> ask(@RequestBody Map<String, Object> body) {
        String question = (String) body.get("question");
        Object eventContext = body.get("eventContext");

        String systemPrompt = """
            You are EventBot, a helpful assistant for an internal department event ticket booking system.
            Answer questions about the event, booking process, OTP verification, available tickets,
            refund policies, and general FAQs. Be concise, friendly, and helpful.
            Keep responses under 3 sentences.
            Event context: %s
            """.formatted(eventContext != null ? eventContext.toString() : "No event context provided");

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", anthropicApiKey);
            headers.set("anthropic-version", "2023-06-01");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "claude-haiku-4-5-20251001");
            requestBody.put("max_tokens", 300);
            requestBody.put("system", systemPrompt);
            requestBody.put("messages", List.of(
                    Map.of("role", "user", "content", question)
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.anthropic.com/v1/messages", entity, Map.class
            );

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> content = (List<Map<String, Object>>) response.getBody().get("content");
            String answer = (String) content.get(0).get("text");
            return ResponseEntity.ok(Map.of("answer", answer));

        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("answer",
                    "I can help you with booking tickets, OTP verification, event details, and general FAQs. What would you like to know?"));
        }
    }
}
