package com.journal.dto;

import com.journal.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

  private String token;
  private User user;
}
