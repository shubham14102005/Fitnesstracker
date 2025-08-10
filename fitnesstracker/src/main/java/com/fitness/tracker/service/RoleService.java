	package com.fitness.tracker.service;
	
	import com.fitness.tracker.model.Role;
	import com.fitness.tracker.repository.RoleRepository;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.stereotype.Service;
	import java.util.List;
	import java.util.Optional;
	
	@Service
	public class RoleService {
	
	    @Autowired
	    private RoleRepository roleRepository;
	
	    public List<Role> getAllRoles() {
	        return roleRepository.findAll();
	    }
	
	    public Optional<Role> getRoleById(Long id) {
	        return roleRepository.findById(id);
	    }
	
	    public Role saveRole(Role role) {
	        return roleRepository.save(role);
	    }
	
	    public void deleteRole(Long id) {
	        roleRepository.deleteById(id);
	    }
	}
