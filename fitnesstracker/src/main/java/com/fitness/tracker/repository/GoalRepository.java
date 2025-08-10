package com.fitness.tracker.repository;


import com.fitness.tracker.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoalRepository extends JpaRepository<Goal, Long> {
}