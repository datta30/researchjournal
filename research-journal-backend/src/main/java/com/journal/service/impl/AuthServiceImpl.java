package com.journal.service.impl;

import com.journal.dto.AuthRequest;
import com.journal.dto.AuthResponse;
import com.journal.dto.RegisterRequest;
import com.journal.exception.BadRequestException;
import com.journal.model.User;
import com.journal.repository.UserRepository;
import com.journal.security.JwtTokenProvider;
import com.journal.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider jwtTokenProvider;

  public AuthServiceImpl(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager,
      JwtTokenProvider jwtTokenProvider) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtTokenProvider = jwtTokenProvider;
  }

  @Override
  public void register(RegisterRequest request) {
    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
      throw new BadRequestException("Email already in use");
    }
    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(request.getRole() != null ? request.getRole() : com.journal.model.enums.Role.AUTHOR);
    userRepository.save(user);
  }

  @Override
  public AuthResponse login(AuthRequest request) {
    Authentication authentication =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
    UserDetails principal = (UserDetails) authentication.getPrincipal();
    User user = userRepository
        .findByEmail(principal.getUsername())
        .orElseThrow(() -> new BadRequestException("Invalid credentials"));
    String token = jwtTokenProvider.generateToken(principal);
    User sanitized = new User();
    sanitized.setId(user.getId());
    sanitized.setName(user.getName());
    sanitized.setEmail(user.getEmail());
    sanitized.setRole(user.getRole());
    return new AuthResponse(token, sanitized);
  }
}
