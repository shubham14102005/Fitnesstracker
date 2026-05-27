package com.fitness.tracker.controller;

import com.fitness.tracker.model.Meal;
import com.fitness.tracker.service.MealService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/meals")
public class MealController {
    @Autowired
    private MealService mealService;

    @GetMapping
    public ResponseEntity<List<Meal>> getAllMeals() {
        return ResponseEntity.ok(mealService.getAllMeals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Meal> getMealById(@PathVariable Long id) {
        Meal meal = mealService.getMealById(id);
        if (meal == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(meal);
    }

    @PostMapping
    public ResponseEntity<Meal> createMeal(@Valid @RequestBody Meal meal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mealService.createMeal(meal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Meal> updateMeal(@PathVariable Long id, @Valid @RequestBody Meal updatedMeal) {
        Meal meal = mealService.updateMeal(id, updatedMeal);
        if (meal == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(meal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable Long id) {
        mealService.deleteMeal(id);
        return ResponseEntity.noContent().build();
    }
}