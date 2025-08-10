package com.fitness.tracker.service;

import com.fitness.tracker.model.Goal;
import com.fitness.tracker.repository.GoalRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GoalService {
    @Autowired
    private GoalRepository goalRepository;

    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }

    public Goal getGoalById(Long id) {
        return goalRepository.findById(id).orElse(null);
    }

    @Transactional
    public Goal createGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    @Transactional
    public Goal updateGoal(Long id, Goal updatedGoal) {
        Optional<Goal> existingGoalOpt = goalRepository.findById(id);
        if (existingGoalOpt.isPresent()) {
            Goal existingGoal = existingGoalOpt.get();
            existingGoal.setTargetWeight(updatedGoal.getTargetWeight());
            return goalRepository.save(existingGoal);
        }
        return null;
    }

    @Transactional
    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }
}
