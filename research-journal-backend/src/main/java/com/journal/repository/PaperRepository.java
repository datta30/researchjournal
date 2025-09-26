package com.journal.repository;

import com.journal.model.Paper;
import com.journal.model.enums.PaperStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaperRepository extends JpaRepository<Paper, Long> {

  @EntityGraph(attributePaths = {"author", "assignedReviewer", "plagiarismReport"})
  List<Paper> findByAuthorId(Long authorId);

  @EntityGraph(attributePaths = {"author", "assignedReviewer", "plagiarismReport"})
  List<Paper> findByStatus(PaperStatus status);

  @EntityGraph(attributePaths = {"author", "assignedReviewer", "plagiarismReport"})
  @Query("select p from Paper p where p.assignedReviewer.id = :reviewerId")
  List<Paper> findAssignedToReviewer(@Param("reviewerId") Long reviewerId);

  @EntityGraph(attributePaths = {"author", "assignedReviewer", "plagiarismReport"})
  Optional<Paper> findWithDetailsById(Long id);

  @EntityGraph(attributePaths = {"author", "assignedReviewer", "plagiarismReport"})
  @Query("select p from Paper p")
  List<Paper> findAllWithDetails();
}
