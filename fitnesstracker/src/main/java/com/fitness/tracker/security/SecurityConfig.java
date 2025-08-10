package com.fitness.tracker.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import javax.sql.DataSource;

@Configuration
public class SecurityConfig {

    @Bean
    public UserDetailsManager userDetailsManager(DataSource dataSource) {
        JdbcUserDetailsManager jdbcUserDetailsManager = new JdbcUserDetailsManager(dataSource);

        jdbcUserDetailsManager.setUsersByUsernameQuery(
                "SELECT name, password, enabled FROM user WHERE name = ?");

        jdbcUserDetailsManager.setAuthoritiesByUsernameQuery(
                "SELECT u.name, r.role_name AS authority FROM user u JOIN roles r ON u.id = r.user_id WHERE u.name = ?");

        jdbcUserDetailsManager.setRolePrefix(""); 
        return jdbcUserDetailsManager;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(configurer ->
                configurer
                		.requestMatchers(HttpMethod.GET, "/api/workouts").hasAnyAuthority("manager", "admin","user")
                		.requestMatchers(HttpMethod.GET, "/api/goals").hasAnyAuthority("manager", "admin","user")
                		.requestMatchers(HttpMethod.GET, "/api/meals").hasAnyAuthority("manager", "admin","user")
                		.requestMatchers(HttpMethod.GET, "/api/users").hasAnyAuthority("manager", "admin")
                		.requestMatchers(HttpMethod.GET, "/api/roles").hasAnyAuthority("manager", "admin")
                        .requestMatchers(HttpMethod.POST, "/api/workouts").hasAnyAuthority("manager", "admin")
                        .requestMatchers(HttpMethod.POST, "/api/meals").hasAnyAuthority("manager", "admin")
                        .requestMatchers(HttpMethod.POST, "/api/goals").hasAnyAuthority("manager", "user")
                        .requestMatchers(HttpMethod.POST, "/api/users").hasAnyAuthority("manager", "admin")
                        .requestMatchers(HttpMethod.POST, "/api/roles").hasAnyAuthority( "admin","manager")
                        .requestMatchers(HttpMethod.PUT, "/api/users/**").hasAuthority("admin")
                        .requestMatchers(HttpMethod.PUT, "/api/workouts/**").hasAnyAuthority("manager", "admin")
                        .requestMatchers(HttpMethod.PUT, "/api/meals/**").hasAnyAuthority("manager", "admin")
                        .requestMatchers(HttpMethod.PUT, "/api/goals/**").hasAnyAuthority("manager", "admin")
                        .requestMatchers(HttpMethod.PUT, "/api/roles/**").hasAnyAuthority( "admin","manager")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasAuthority("admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/workouts/**").hasAuthority("admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/meals/**").hasAuthority("admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/goals/**").hasAuthority("admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/roles/**").hasAuthority("admin")

                         
        );

        http.httpBasic(Customizer.withDefaults()); 
        http.csrf(csrf->csrf.disable());

        return http.build();
    }
}