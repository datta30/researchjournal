package com.journal.service.impl;

import com.journal.exception.BadRequestException;
import com.journal.exception.ResourceNotFoundException;
import com.journal.model.Paper;
import com.journal.model.PlagiarismReport;
import com.journal.model.User;
import com.journal.model.enums.PaperStatus;
import com.journal.model.enums.PlagiarismStatus;
import com.journal.model.enums.Role;
import com.journal.repository.PaperRepository;
import com.journal.repository.PlagiarismReportRepository;
import com.journal.repository.UserRepository;
import com.journal.service.FileStorageService;
import com.journal.service.PaperService;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class PaperServiceImpl implements PaperService {

  private final PaperRepository paperRepository;
  private final UserRepository userRepository;
  private final PlagiarismReportRepository plagiarismReportRepository;
  private final FileStorageService fileStorageService;

  public PaperServiceImpl(
      PaperRepository paperRepository,
      UserRepository userRepository,
      PlagiarismReportRepository plagiarismReportRepository,
      FileStorageService fileStorageService) {
    this.paperRepository = paperRepository;
    this.userRepository = userRepository;
    this.plagiarismReportRepository = plagiarismReportRepository;
    this.fileStorageService = fileStorageService;
  }

  @Override
  public Paper uploadPaper(Long authorId, String title, String abstractText, MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new BadRequestException("Paper file is required");
    }
    if (!StringUtils.hasText(title) || !StringUtils.hasText(abstractText)) {
      throw new BadRequestException("Title and abstract are required");
    }
    User author = userRepository
        .findById(authorId)
        .orElseThrow(() -> new ResourceNotFoundException("Author not found"));
    Paper paper = new Paper();
    paper.setAuthor(author);
    paper.setTitle(title);
    paper.setAbstractText(abstractText);
    paper.setFilePath(fileStorageService.store(file));
    paper.setStatus(PaperStatus.SUBMITTED);
    paper.setRevisionHistory("Initial submission on " + OffsetDateTime.now());
    paper.setCreatedAt(OffsetDateTime.now());
    paper.setUpdatedAt(OffsetDateTime.now());
    Paper saved = paperRepository.save(paper);

    PlagiarismReport report = new PlagiarismReport();
    report.setPaper(saved);
    report.setStatus(PlagiarismStatus.PENDING);
    plagiarismReportRepository.save(report);
    saved.setPlagiarismReport(report);
    return saved;
  }

  @Override
  public List<Paper> findSubmissionsForAuthor(Long authorId) {
    return paperRepository.findByAuthorId(authorId);
  }

  @Override
  public Paper submitRevision(Long paperId, Long authorId, String revisionNotes) {
    Paper paper = getById(paperId);
    if (!paper.getAuthor().getId().equals(authorId)) {
      throw new BadRequestException("You can only revise your own paper");
    }
    if (!StringUtils.hasText(revisionNotes)) {
      throw new BadRequestException("Revision notes cannot be empty");
    }
    paper.setRevisionNotes(revisionNotes);
    String history = paper.getRevisionHistory() == null ? "" : paper.getRevisionHistory() + "\n";
    paper.setRevisionHistory(history + "Revision submitted at " + OffsetDateTime.now());
  paper.setLatestFeedback(null);
    paper.setStatus(PaperStatus.UNDER_REVIEW);
    paper.setUpdatedAt(OffsetDateTime.now());
    if (paper.getPlagiarismReport() != null) {
      paper.getPlagiarismReport().setStatus(PlagiarismStatus.PENDING);
      plagiarismReportRepository.save(paper.getPlagiarismReport());
    }
    return paperRepository.save(paper);
  }

  @Override
  public List<Paper> findAll() {
    return paperRepository.findAllWithDetails();
  }

  @Override
  public Paper assignReviewer(Long paperId, Long reviewerId) {
    Paper paper = getById(paperId);
    User reviewer = userRepository
        .findById(reviewerId)
        .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));
    if (reviewer.getRole() != Role.REVIEWER && reviewer.getRole() != Role.EDITOR) {
      throw new BadRequestException("User is not eligible to review");
    }
    paper.setAssignedReviewer(reviewer);
    paper.setStatus(PaperStatus.UNDER_REVIEW);
    paper.setUpdatedAt(OffsetDateTime.now());
    return paperRepository.save(paper);
  }

  @Override
  public Paper updateDecision(Long paperId, PaperStatus status, String feedback) {
    Paper paper = getById(paperId);
    paper.setStatus(status);
    if (feedback != null && !feedback.isBlank()) {
      paper.setLatestFeedback(feedback);
    }
    paper.setUpdatedAt(OffsetDateTime.now());
    if (paper.getPlagiarismReport() != null && (status == PaperStatus.ACCEPTED || status == PaperStatus.REJECTED)) {
      paper
          .getPlagiarismReport()
          .setStatus(status == PaperStatus.ACCEPTED ? PlagiarismStatus.CLEARED : PlagiarismStatus.FLAGGED);
      plagiarismReportRepository.save(paper.getPlagiarismReport());
    }
    return paperRepository.save(paper);
  }

  @Override
  public List<Paper> findPublished() {
    return paperRepository.findByStatus(PaperStatus.ACCEPTED);
  }

  @Override
  public List<Paper> findAssignmentsForReviewer(Long reviewerId) {
    return paperRepository.findAssignedToReviewer(reviewerId);
  }

  @Override
  public Paper getById(Long paperId) {
    return paperRepository
        .findWithDetailsById(paperId)
        .orElseThrow(() -> new ResourceNotFoundException("Paper not found"));
  }
}
