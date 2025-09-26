package com.journal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.journal.model.enums.PlagiarismStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "plagiarism_reports")
@Getter
@Setter
@NoArgsConstructor
public class PlagiarismReport {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "paper_id")
  @JsonIgnoreProperties({"plagiarismReport", "reviews", "author", "assignedReviewer"})
  private Paper paper;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 30)
  private PlagiarismStatus status = PlagiarismStatus.PENDING;

  private Double similarityScore;
}
