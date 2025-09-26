package com.journal.service;

import com.journal.dto.AuthRequest;
import com.journal.dto.AuthResponse;
import com.journal.dto.RegisterRequest;

public interface AuthService {

  void register(RegisterRequest request);

  AuthResponse login(AuthRequest request);
}
