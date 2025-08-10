package com.fitness.tracker.repository;


import com.fitness.tracker.model.Meal;

import org.springframework.data.jpa.repository.JpaRepository;
public interface MealRepository extends JpaRepository<Meal, Long> {
}
