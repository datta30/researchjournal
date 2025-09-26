package com.journal.repository;

import com.journal.model.Review;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {

  List<Review> findByReviewerId(Long reviewerId);

  List<Review> findByPaperId(Long paperId);
}
