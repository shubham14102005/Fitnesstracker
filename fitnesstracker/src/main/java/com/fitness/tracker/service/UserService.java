package com.fitness.tracker.service;

import com.fitness.tracker.model.User;
import com.fitness.tracker.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
    public User createUser(User user) {
        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true);
        
        // Assign default ROLE_USER role
        com.fitness.tracker.model.Role defaultRole = new com.fitness.tracker.model.Role();
        defaultRole.setRoleName("ROLE_USER");
        defaultRole.setUser(user);
        user.setR(java.util.List.of(defaultRole));
        
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            existingUser.setName(updatedUser.getName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setAge(updatedUser.getAge());
            existingUser.setWeight(updatedUser.getWeight());
            existingUser.setHeight(updatedUser.getHeight());
            
            // Update password if provided and not empty
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }
            
            return userRepository.save(existingUser);
        }
        return null;
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User validateCredentials(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    @Transactional
    public void generateAndSendOtpForUser(User user) {
        String generatedOtp = String.valueOf((int) (Math.random() * 900000) + 100000);
        user.setOtp(generatedOtp);
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        emailService.sendEmail(
            user.getEmail(),
            "FitNexus Account Verification - OTP",
            "Welcome to FitNexus!\n\nYour One-Time Password (OTP) for account verification is: " + generatedOtp + "\n\nThis OTP will expire in 5 minutes."
        );
    }

    @Transactional
    public User generateAndSendOtp(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                String generatedOtp = String.valueOf((int) (Math.random() * 900000) + 100000);
                user.setOtp(generatedOtp);
                user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(5));
                userRepository.save(user);

                emailService.sendEmail(
                    email,
                    "FitNexus Login - OTP",
                    "Hello,\n\nYour One-Time Password (OTP) for logging into FitNexus is: " + generatedOtp + "\n\nThis OTP will expire in 5 minutes."
                );
                return user;
            }
        }
        return null;
    }

    @Transactional
    public User verifyOtp(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getOtp() != null && user.getOtp().equals(otp) &&
                user.getOtpExpiry() != null && user.getOtpExpiry().isAfter(java.time.LocalDateTime.now())) {
                user.setOtp(null);
                user.setOtpExpiry(null);
                return userRepository.save(user);
            }
        }
        return null;
    }

    @Transactional
    public boolean generatePasswordResetCode(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String code = String.valueOf((int) (Math.random() * 900000) + 100000);
            user.setResetCode(code);
            user.setResetCodeExpiry(java.time.LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);

            emailService.sendEmail(
                email,
                "FitNexus Password Reset Code",
                "Hello,\n\nYou requested a password reset for your FitNexus account. Your password reset code is: " + code + "\n\nThis code will expire in 15 minutes."
            );
            return true;
        }
        return false;
    }

    @Transactional
    public boolean resetPasswordWithCode(String email, String code, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getResetCode() != null && user.getResetCode().equals(code) &&
                user.getResetCodeExpiry() != null && user.getResetCodeExpiry().isAfter(java.time.LocalDateTime.now())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetCode(null);
                user.setResetCodeExpiry(null);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }
}
