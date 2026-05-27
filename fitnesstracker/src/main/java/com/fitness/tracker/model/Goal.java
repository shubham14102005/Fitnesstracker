package com.fitness.tracker.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

@Entity
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Target weight is required")
    @Positive(message = "Target weight must be positive")
    private double targetWeight;
    
    @NotNull(message = "Target calories is required")
    @Positive(message = "Target calories must be positive")
    private int targetCalories;
    
    @NotNull(message = "Deadline is required")
    private LocalDate deadline;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"workouts", "meals", "r", "goal"})
    private User user;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public double getTargetWeight() {
		return targetWeight;
	}

	public void setTargetWeight(double targetWeight) {
		this.targetWeight = targetWeight;
	}

	public int getTargetCalories() {
		return targetCalories;
	}

	public void setTargetCalories(int targetCalories) {
		this.targetCalories = targetCalories;
	}

	public LocalDate getDeadline() {
		return deadline;
	}

	public void setDeadline(LocalDate deadline) {
		this.deadline = deadline;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

    
}
