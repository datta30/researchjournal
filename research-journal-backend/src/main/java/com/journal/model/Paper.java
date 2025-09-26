package com.journal.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.journal.model.enums.PaperStatus;
import com.journal.model.PlagiarismReport;
import com.journal.model.Review;
import com.journal.model.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "papers")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Paper {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Lob
  @Column(nullable = false, columnDefinition = "LONGTEXT")
  private String abstractText;

  private String filePath;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 50)
  private PaperStatus status = PaperStatus.SUBMITTED;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "author_id")
  @JsonIgnoreProperties({"submissions", "reviews", "permissions"})
  private User author;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "assigned_reviewer_id")
  @JsonIgnoreProperties({"submissions", "reviews", "permissions"})
  private User assignedReviewer;

  @OneToMany(mappedBy = "paper", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<Review> reviews = new ArrayList<>();

  @OneToOne(mappedBy = "paper", cascade = CascadeType.ALL, orphanRemoval = true)
  private PlagiarismReport plagiarismReport;

  @Lob
  @Column(columnDefinition = "LONGTEXT")
  private String revisionHistory;

  @Column(columnDefinition = "TEXT")
  private String latestFeedback;

  @Column(columnDefinition = "TEXT")
  private String revisionNotes;

  private OffsetDateTime createdAt;

  private OffsetDateTime updatedAt;

  @PrePersist
  public void onCreate() {
    OffsetDateTime now = OffsetDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @PreUpdate
  public void onUpdate() {
    this.updatedAt = OffsetDateTime.now();
  }
}
