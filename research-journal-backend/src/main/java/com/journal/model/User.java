package com.journal.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.journal.model.Paper;
import com.journal.model.Review;
import com.journal.model.enums.Role;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  @NotBlank
  private String name;

  @Column(nullable = false, unique = true)
  @Email
  @NotBlank
  private String email;

  @Column(nullable = false)
  @JsonIgnore
  @NotBlank
  @Size(min = 8, message = "Password must be at least 8 characters")
  private String password;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private Role role;

  @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
  @JsonIgnore
  private List<Paper> submissions = new ArrayList<>();

  @OneToMany(mappedBy = "reviewer", fetch = FetchType.LAZY)
  @JsonIgnore
  private List<Review> reviews = new ArrayList<>();

  @ElementCollection(fetch = FetchType.EAGER)
  private Set<String> permissions = new HashSet<>();
}
