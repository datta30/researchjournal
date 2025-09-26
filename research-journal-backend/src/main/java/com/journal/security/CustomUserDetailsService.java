package com.journal.security;

import com.journal.model.User;
import com.journal.repository.UserRepository;
import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  public CustomUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user =
        userRepository
            .findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    return new org.springframework.security.core.userdetails.User(
        user.getEmail(), user.getPassword(), mapAuthorities(user));
  }

  private Collection<? extends GrantedAuthority> mapAuthorities(User user) {
    return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
  }
}
