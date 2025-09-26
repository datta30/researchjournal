package com.journal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.journal.model.enums.ReviewDecision;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
public class Review {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "paper_id")
  @JsonIgnoreProperties({"reviews", "author", "assignedReviewer", "plagiarismReport"})
  private Paper paper;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "reviewer_id")
  @JsonIgnoreProperties({"submissions", "reviews", "permissions"})
  private User reviewer;

  @Column(columnDefinition = "TEXT")
  private String comments;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private ReviewDecision decision;

  private OffsetDateTime submittedAt = OffsetDateTime.now();
}
