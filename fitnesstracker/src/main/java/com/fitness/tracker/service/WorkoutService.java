package com.fitness.tracker.service;

import com.fitness.tracker.model.Workout;
import com.fitness.tracker.repository.WorkoutRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class WorkoutService {
    @Autowired
    private WorkoutRepository workoutRepository;

    public List<Workout> getAllWorkouts() {
        return workoutRepository.findAll();
    }

    public Workout getWorkoutById(Long id) {
        return workoutRepository.findById(id).orElse(null);
    }

    @Transactional
    public Workout createWorkout(Workout workout) {
        return workoutRepository.save(workout);
    }

    @Transactional
    public Workout updateWorkout(Long id, Workout updatedWorkout) {
        Optional<Workout> existingWorkoutOpt = workoutRepository.findById(id);
        if (existingWorkoutOpt.isPresent()) {
            Workout existingWorkout = existingWorkoutOpt.get();
            existingWorkout.setDuration(updatedWorkout.getDuration());
            existingWorkout.setCaloriesBurned(updatedWorkout.getCaloriesBurned());
            return workoutRepository.save(existingWorkout);
        }
        return null;
    }

    @Transactional
    public void deleteWorkout(Long id) {
        workoutRepository.deleteById(id);
    }
}
