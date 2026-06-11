package com.fitness.tracker.service;

import com.fitness.tracker.model.User;
import com.fitness.tracker.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.EntityManager;
import jakarta.annotation.PostConstruct;

@Service
@SuppressWarnings("null")
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;



    @PersistenceContext
    private EntityManager entityManager;

    @PostConstruct
    @Transactional
    public void cleanupDuplicateRoles() {
        try {
            System.out.println("[DB CLEANUP] Checking and cleaning duplicate or redundant user roles...");
            // 1. Delete ROLE_USER for anyone who also has ROLE_TRAINER or ROLE_ADMIN
            entityManager.createNativeQuery(
                "DELETE FROM roles WHERE role_name = 'ROLE_USER' AND user_id IN (" +
                "  SELECT user_id FROM (SELECT user_id FROM roles WHERE role_name IN ('ROLE_TRAINER', 'ROLE_ADMIN')) AS temp" +
                ")"
            ).executeUpdate();

            // 2. Delete duplicate identical role records (keeping the one with the minimum ID)
            entityManager.createNativeQuery(
                "DELETE FROM roles WHERE id NOT IN (" +
                "  SELECT min_id FROM (SELECT MIN(id) AS min_id FROM roles GROUP BY user_id, role_name) AS temp" +
                ")"
            ).executeUpdate();
            System.out.println("[DB CLEANUP] Duplicate roles cleaned up successfully.");
        } catch (Exception e) {
            System.out.println("[DB CLEANUP] Info: " + e.getMessage());
        }
    }

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
        
        // Assign default ROLE_USER role ONLY if no roles are provided
        if (user.getR() == null || user.getR().isEmpty()) {
            com.fitness.tracker.model.Role defaultRole = new com.fitness.tracker.model.Role();
            defaultRole.setRoleName("ROLE_USER");
            defaultRole.setUser(user);
            user.setR(java.util.List.of(defaultRole));
        } else {
            // Ensure bidirectional link is set for provided roles
            for (com.fitness.tracker.model.Role role : user.getR()) {
                role.setUser(user);
            }
        }
        
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
        // Nullify assigned_by_id references in workout and meal tables to prevent foreign key violations
        entityManager.createNativeQuery("UPDATE workout SET assigned_by_id = NULL WHERE assigned_by_id = :id")
                     .setParameter("id", id)
                     .executeUpdate();
        entityManager.createNativeQuery("UPDATE meal SET assigned_by_id = NULL WHERE assigned_by_id = :id")
                     .setParameter("id", id)
                     .executeUpdate();
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


}
