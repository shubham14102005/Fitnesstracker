package com.fitness.tracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    @Value("${spring.mail.from:}")
    private String smtpFrom;

    @Value("${resend.api.key:}")
    private String resendApiKey;

    @Value("${resend.from.email:onboarding@resend.dev}")
    private String resendFromEmail;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public void sendEmail(String to, String subject, String body) {
        // 1. Try Resend HTTP API if configured
        if (resendApiKey != null && !resendApiKey.trim().isEmpty()) {
            System.out.println("[EMAIL INFO] Attempting to send email via Resend API...");
            try {
                // Escape body content and format newlines to <br/> tags
                String htmlBody = body.replace("\n", "<br/>");
                String escapedBody = htmlBody.replace("\\", "\\\\")
                                             .replace("\"", "\\\"")
                                             .replace("\r", "");

                String jsonPayload = String.format(
                    "{\"from\":\"FitNexus <%s>\",\"to\":[\"%s\"],\"subject\":\"%s\",\"html\":\"<p>%s</p>\"}",
                    resendFromEmail.trim(), to, subject, escapedBody
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
                    return;
                } else {
                    System.out.printf("[EMAIL ERROR] Resend API returned status %d: %s. Falling back...\n", response.statusCode(), response.body());
                }
            } catch (Exception e) {
                System.out.printf("[EMAIL ERROR] Failed to send email via Resend API to %s: %s. Falling back...\n", to, e.getMessage());
            }
        }

        // 2. Try SMTP if configured
        if (mailSender != null && smtpUsername != null && !smtpUsername.trim().isEmpty()) {
            System.out.println("[EMAIL INFO] Attempting to send email via SMTP...");
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                // If smtpFrom is configured, use it. Otherwise fall back to smtpUsername.
                String fromAddress = (smtpFrom != null && !smtpFrom.trim().isEmpty()) ? smtpFrom.trim() : smtpUsername.trim();
                message.setFrom(fromAddress);
                message.setTo(to);
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                System.out.printf("[EMAIL SUCCESS] Real email sent successfully via SMTP to %s\n", to);
                return;
            } catch (Exception e) {
                System.out.printf("[EMAIL ERROR] Failed to send email via SMTP to %s: %s. Falling back to Mock.\n", to, e.getMessage());
            }
        }

        // 3. Fallback to Mock console logging
        System.out.println("[EMAIL INFO] Falling back to Mock console logging.");
        logMockEmail(to, subject, body);
    }

    private void logMockEmail(String to, String subject, String body) {
        System.out.println("\n==================================================");
        System.out.printf("[MAIL MOCK FALLBACK]\nTo: %s\nSubject: %s\nBody: %s\n", to, subject, body);
        System.out.println("==================================================\n");
    }
}
