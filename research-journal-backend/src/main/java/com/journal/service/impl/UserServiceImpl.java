package com.journal.service.impl;

import com.journal.exception.BadRequestException;
import com.journal.exception.ResourceNotFoundException;
import com.journal.model.User;
import com.journal.model.enums.Role;
import com.journal.repository.UserRepository;
import com.journal.service.UserService;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;

  public UserServiceImpl(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null) {
      throw new ResourceNotFoundException("No authenticated user found");
    }
    String email;
    Object principal = authentication.getPrincipal();
    if (principal instanceof UserDetails userDetails) {
      email = userDetails.getUsername();
    } else if (principal instanceof String principalString) {
      email = principalString;
    } else {
      throw new ResourceNotFoundException("Unable to resolve current user");
    }
    return userRepository
        .findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
  }

  @Override
  public List<User> getUsers(Optional<String> role) {
    if (role.isPresent()) {
      try {
        Role enumRole = Role.valueOf(role.get().toUpperCase(Locale.ROOT));
        return userRepository.findByRole(enumRole);
      } catch (IllegalArgumentException ex) {
        throw new BadRequestException("Invalid role filter");
      }
    }
    return userRepository.findAll();
  }

  @Override
  public void deleteUser(Long id) {
    if (!userRepository.existsById(id)) {
      throw new ResourceNotFoundException("User not found");
    }
    userRepository.deleteById(id);
  }

  @Override
  public User getById(Long id) {
    return userRepository
        .findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
  }
}
