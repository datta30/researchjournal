package com.journal.service.impl;

import com.journal.dto.ReviewSubmitRequest;
import com.journal.exception.BadRequestException;
import com.journal.exception.ResourceNotFoundException;
import com.journal.model.Paper;
import com.journal.model.Review;
import com.journal.model.enums.PaperStatus;
import com.journal.model.enums.ReviewDecision;
import com.journal.repository.PaperRepository;
import com.journal.repository.ReviewRepository;
import com.journal.service.ReviewService;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

  private final PaperRepository paperRepository;
  private final ReviewRepository reviewRepository;

  public ReviewServiceImpl(PaperRepository paperRepository, ReviewRepository reviewRepository) {
    this.paperRepository = paperRepository;
    this.reviewRepository = reviewRepository;
  }

  @Override
  public List<Paper> getAssignments(Long reviewerId) {
    return paperRepository.findAssignedToReviewer(reviewerId);
  }

  @Override
  public Review submitReview(Long paperId, Long reviewerId, ReviewSubmitRequest request) {
    Paper paper =
        paperRepository
            .findById(paperId)
            .orElseThrow(() -> new ResourceNotFoundException("Paper not found"));
    if (paper.getAssignedReviewer() == null || !paper.getAssignedReviewer().getId().equals(reviewerId)) {
      throw new BadRequestException("You are not assigned to this paper");
    }
    Review review = new Review();
    review.setPaper(paper);
    review.setReviewer(paper.getAssignedReviewer());
    review.setComments(request.getComments());
    review.setDecision(request.getDecision());
    review.setSubmittedAt(OffsetDateTime.now());
    paper.setLatestFeedback(request.getComments());
  paper.getReviews().add(review);
    if (request.getDecision() == ReviewDecision.APPROVE) {
      paper.setStatus(PaperStatus.UNDER_REVIEW);
    }
    if (request.getDecision() == ReviewDecision.REJECT) {
      paper.setStatus(PaperStatus.UNDER_REVIEW);
    }
    paper.setUpdatedAt(OffsetDateTime.now());
    paperRepository.save(paper);
    return reviewRepository.save(review);
  }
}
