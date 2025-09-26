package com.journal.service;

import com.journal.dto.ReviewSubmitRequest;
import com.journal.model.Paper;
import com.journal.model.Review;
import java.util.List;

public interface ReviewService {

  List<Paper> getAssignments(Long reviewerId);

  Review submitReview(Long paperId, Long reviewerId, ReviewSubmitRequest request);
}
