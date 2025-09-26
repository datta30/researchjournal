package com.journal.config;

import com.journal.model.User;
import com.journal.model.enums.Role;
import com.journal.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) {
    if (userRepository.findByEmail("admin@journal.com").isEmpty()) {
      User admin = new User();
      admin.setName("System Admin");
      admin.setEmail("admin@journal.com");
      admin.setPassword(passwordEncoder.encode("password"));
      admin.setRole(Role.ADMIN);
      userRepository.save(admin);
    }
  }
}
