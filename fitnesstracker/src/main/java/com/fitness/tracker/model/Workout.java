package com.fitness.tracker.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Entity
public class Workout {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Workout type is required")
    private String type;
    
    @Positive(message = "Duration must be positive")
    private int duration;
    
    @Positive(message = "Calories burned must be positive")
    private int caloriesBurned;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"workouts", "meals", "r", "goal"})
    private User user;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getDuration() {
		return duration;
	}

	public void setDuration(int duration) {
		this.duration = duration;
	}

	public int getCaloriesBurned() {
		return caloriesBurned;
	}

	public void setCaloriesBurned(int caloriesBurned) {
		this.caloriesBurned = caloriesBurned;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

    @ManyToOne
    @JoinColumn(name = "assigned_by_id")
    @JsonIgnoreProperties({"workouts", "meals", "r", "goal"})
    private User assignedBy;

    private java.time.LocalDate date;

    public User getAssignedBy() { return assignedBy; }
    public void setAssignedBy(User assignedBy) { this.assignedBy = assignedBy; }

    public java.time.LocalDate getDate() { return date; }
    public void setDate(java.time.LocalDate date) { this.date = date; }
}
