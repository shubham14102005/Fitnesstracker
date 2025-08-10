package com.fitness.tracker.model;

import jakarta.persistence.*;


import java.util.List;


import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity
public class User {
 
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private int age;
    @Column(nullable = false)
    private String password;
    private double weight;
    private double height;
    
    @Column(nullable = false)
    private boolean enabled;

 	
    public boolean isEnabled() {
		return enabled;
	}
	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonManagedReference
    private List<Workout> workouts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Meal> meals;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Goal goal;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Role> r;

    public List<Role> getR() {
 		return r;
 	}
 	public void setR(List<Role> r) {
 		this.r = r;
 	}
 	
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }

    public double getHeight() { return height; }
    public void setHeight(double height) { this.height = height; }
}
