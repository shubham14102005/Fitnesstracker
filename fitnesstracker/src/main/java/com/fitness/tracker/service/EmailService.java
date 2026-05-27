package com.fitness.tracker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    @Value("${resend.api.key:}")
    private String resendApiKey;

    @Value("${resend.from.email:onboarding@resend.dev}")
    private String fromEmail;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public void sendEmail(String to, String subject, String body) {
        // If Resend API key is not configured, fall back to console mock
        if (resendApiKey == null || resendApiKey.trim().isEmpty()) {
            System.out.println("[EMAIL INFO] RESEND_API_KEY not configured. Falling back to Mock console logging.");
            logMockEmail(to, subject, body);
            return;
        }

        try {
            // Escape body content for simple JSON payload
            String escapedBody = body.replace("\\", "\\\\")
                                     .replace("\"", "\\\"")
                                     .replace("\n", "\\n")
                                     .replace("\r", "\\r");

            String jsonPayload = String.format(
                "{\"from\":\"FitNexus <%s>\",\"to\":[\"%s\"],\"subject\":\"%s\",\"html\":\"<p>%s</p>\"}",
                fromEmail, to, subject, escapedBody
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200 || response.statusCode() == 201) {
                System.out.printf("[EMAIL SUCCESS] Real email sent via Resend HTTP API to %s (Status: %d)\n", to, response.statusCode());
            } else {
                System.out.printf("[EMAIL ERROR] Resend returned error status %d: %s. Falling back to Mock.\n", response.statusCode(), response.body());
                logMockEmail(to, subject, body);
            }
        } catch (Exception e) {
            System.out.printf("[EMAIL ERROR] Failed to send email via Resend API to %s: %s. Falling back to Mock.\n", to, e.getMessage());
            logMockEmail(to, subject, body);
        }
    }

    private void logMockEmail(String to, String subject, String body) {
        System.out.println("\n==================================================");
        System.out.printf("[MAIL MOCK FALLBACK]\nTo: %s\nSubject: %s\nBody: %s\n", to, subject, body);
        System.out.println("==================================================\n");
    }
}
