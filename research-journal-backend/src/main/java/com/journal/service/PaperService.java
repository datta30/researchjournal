package com.journal.service;

import com.journal.model.Paper;
import com.journal.model.enums.PaperStatus;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface PaperService {

  Paper uploadPaper(Long authorId, String title, String abstractText, MultipartFile file);

  List<Paper> findSubmissionsForAuthor(Long authorId);

  Paper submitRevision(Long paperId, Long authorId, String revisionNotes);

  List<Paper> findAll();

  Paper assignReviewer(Long paperId, Long reviewerId);

  Paper updateDecision(Long paperId, PaperStatus status, String feedback);

  List<Paper> findPublished();

  List<Paper> findAssignmentsForReviewer(Long reviewerId);

  Paper getById(Long paperId);
}
