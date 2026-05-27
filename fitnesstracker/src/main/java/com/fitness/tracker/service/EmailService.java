package com.fitness.tracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    public void sendEmail(String to, String subject, String body) {
        // If SMTP credentials are not configured, fallback to console mock automatically
        if (mailSender == null || smtpUsername == null || smtpUsername.trim().isEmpty()) {
            System.out.println("[EMAIL INFO] SMTP credentials not set. Falling back to Mock console logging.");
            logMockEmail(to, subject, body);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(smtpUsername);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.printf("[EMAIL SUCCESS] Real email sent successfully to %s\n", to);
        } catch (Exception e) {
            System.out.printf("[EMAIL ERROR] Failed to send real email to %s: %s. Falling back to Mock.\n", to, e.getMessage());
            logMockEmail(to, subject, body);
        }
    }

    private void logMockEmail(String to, String subject, String body) {
        System.out.println("\n==================================================");
        System.out.printf("[MAIL MOCK FALLBACK]\nTo: %s\nSubject: %s\nBody: %s\n", to, subject, body);
        System.out.println("==================================================\n");
    }
}
