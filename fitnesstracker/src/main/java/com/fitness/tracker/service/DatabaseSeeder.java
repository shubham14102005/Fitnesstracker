package com.fitness.tracker.service;

import com.fitness.tracker.model.*;
import com.fitness.tracker.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only seed if no users exist in the database
        if (userRepository.count() == 0) {
            System.out.println("Seeding database with default users and metrics...");

            // 1. Seed Admin User
            User admin = new User();
            admin.setName("Admin ");
            admin.setEmail("admin@fitness.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setAge(35);
            admin.setWeight(82.5);
            admin.setHeight(1.85);
            admin.setEnabled(true);
            admin = userRepository.save(admin);

            Role adminRole = new Role();
            adminRole.setRoleName("ROLE_ADMIN");
            adminRole.setUser(admin);
            roleRepository.save(adminRole);

            // 2. Seed Trainer User
            User trainer = new User();
            trainer.setName("Trainer ");
            trainer.setEmail("traner@gmail.com");
            trainer.setPassword(passwordEncoder.encode("Manager@123"));
            trainer.setAge(28);
            trainer.setWeight(76.0);
            trainer.setHeight(1.78);
            trainer.setEnabled(true);
            trainer = userRepository.save(trainer);

            Role trainerRole = new Role();
            trainerRole.setRoleName("ROLE_TRAINER");
            trainerRole.setUser(trainer);
            roleRepository.save(trainerRole);

            // 3. Seed Shubham (Regular User)
            User alice = new User();
            alice.setName("Shubham ");
            alice.setEmail("srvaghani22@gmail.com");
            alice.setPassword(passwordEncoder.encode("Shubham@123"));
            alice.setAge(24);
            alice.setWeight(62.0);
            alice.setHeight(1.68);
            alice.setEnabled(true);
            alice = userRepository.save(alice);

            Role aliceRole = new Role();
            aliceRole.setRoleName("ROLE_USER");
            aliceRole.setUser(alice);
            roleRepository.save(aliceRole);

            // 4. Seed Goal for Alice
            Goal aliceGoal = new Goal();
            aliceGoal.setTargetWeight(57.5);
            aliceGoal.setTargetCalories(1800);
            aliceGoal.setDeadline(LocalDate.now().plusMonths(3));
            aliceGoal.setUser(alice);
            goalRepository.save(aliceGoal);

            // 5. Seed Workouts for Alice
            Workout workout1 = new Workout();
            workout1.setType("Running");
            workout1.setDuration(35);
            workout1.setCaloriesBurned(350);
            workout1.setUser(alice);
            workout1.setAssignedBy(trainer);
            workout1.setDate(LocalDate.now());
            workoutRepository.save(workout1);

            Workout workout2 = new Workout();
            workout2.setType("Strength Training");
            workout2.setDuration(45);
            workout2.setCaloriesBurned(280);
            workout2.setUser(alice);
            workout2.setAssignedBy(trainer);
            workout2.setDate(LocalDate.now());
            workoutRepository.save(workout2);

            // 6. Seed Meals for Alice
            Meal meal1 = new Meal();
            meal1.setName("Oatmeal with Blueberries & Honey");
            meal1.setCalories(420);
            meal1.setDate(LocalDate.now());
            meal1.setUser(alice);
            meal1.setAssignedBy(trainer);
            mealRepository.save(meal1);

            Meal meal2 = new Meal();
            meal2.setName("Grilled Salmon with Quinoa & Broccoli");
            meal2.setCalories(650);
            meal2.setDate(LocalDate.now());
            meal2.setUser(alice);
            meal2.setAssignedBy(trainer);
            mealRepository.save(meal2);

            System.out.println("Database seeding completed successfully!");
        }
    }
}
