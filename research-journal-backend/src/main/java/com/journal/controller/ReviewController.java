package com.journal.controller;

import com.journal.dto.ReviewSubmitRequest;
import com.journal.model.Paper;
import com.journal.model.User;
import com.journal.service.ReviewService;
import com.journal.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
@PreAuthorize("hasAnyRole('REVIEWER','ADMIN')")
public class ReviewController {

  private final ReviewService reviewService;
  private final UserService userService;

  public ReviewController(ReviewService reviewService, UserService userService) {
    this.reviewService = reviewService;
    this.userService = userService;
  }

  @GetMapping("/my-assignments")
  public ResponseEntity<List<Paper>> myAssignments() {
    User currentUser = userService.getCurrentUser();
    return ResponseEntity.ok(reviewService.getAssignments(currentUser.getId()));
  }

  @PostMapping("/submit/{paperId}")
  public ResponseEntity<Map<String, String>> submit(
      @PathVariable Long paperId, @Valid @RequestBody ReviewSubmitRequest request) {
    User currentUser = userService.getCurrentUser();
    reviewService.submitReview(paperId, currentUser.getId(), request);
    return ResponseEntity.ok(Map.of("message", "Review submitted"));
  }
}
