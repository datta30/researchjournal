package com.journal.service;

import com.journal.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {

  User getCurrentUser();

  List<User> getUsers(Optional<String> role);

  void deleteUser(Long id);

  User getById(Long id);
}
