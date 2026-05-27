package com.fitness.tracker.service;

import com.fitness.tracker.model.Meal;
import com.fitness.tracker.repository.MealRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class MealService {
    @Autowired
    private MealRepository mealRepository;

    public List<Meal> getAllMeals() {
        return mealRepository.findAll();
    }

    public Meal getMealById(Long id) {
        return mealRepository.findById(id).orElse(null);
    }

    @Transactional
    public Meal createMeal(Meal meal) {
        return mealRepository.save(meal);
    }

    @Transactional
    public Meal updateMeal(Long id, Meal updatedMeal) {
        Optional<Meal> existingMealOpt = mealRepository.findById(id);
        if (existingMealOpt.isPresent()) {
            Meal existingMeal = existingMealOpt.get();
            existingMeal.setName(updatedMeal.getName());
            existingMeal.setCalories(updatedMeal.getCalories());
            existingMeal.setDate(updatedMeal.getDate());
            existingMeal.setUser(updatedMeal.getUser());
            existingMeal.setAssignedBy(updatedMeal.getAssignedBy());
            return mealRepository.save(existingMeal);
        }
        return null;
    }

    @Transactional
    public void deleteMeal(Long id) {
        mealRepository.deleteById(id);
    }
}
