package com.journal.controller;

import com.journal.dto.PaperDecisionRequest;
import com.journal.dto.RevisionRequest;
import com.journal.exception.ResourceNotFoundException;
import com.journal.model.Paper;
import com.journal.model.User;
import com.journal.model.enums.Role;
import com.journal.service.FileStorageService;
import com.journal.service.PaperService;
import com.journal.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

@RestController
@RequestMapping("/api/papers")
public class PaperController {

  private final PaperService paperService;
  private final UserService userService;
  private final FileStorageService fileStorageService;

  public PaperController(PaperService paperService, UserService userService, FileStorageService fileStorageService) {
    this.paperService = paperService;
    this.userService = userService;
    this.fileStorageService = fileStorageService;
  }

  @PostMapping("/upload")
  @PreAuthorize("hasAnyRole('AUTHOR','ADMIN')")
  public ResponseEntity<Paper> uploadPaper(
      @RequestParam String title,
      @RequestParam("abstractText") String abstractText,
      @RequestParam("file") MultipartFile file) {
    User currentUser = userService.getCurrentUser();
    Paper saved = paperService.uploadPaper(currentUser.getId(), title, abstractText, file);
    return ResponseEntity.ok(saved);
  }

  @GetMapping("/my-submissions")
  @PreAuthorize("hasAnyRole('AUTHOR','ADMIN')")
  public ResponseEntity<List<Paper>> mySubmissions() {
    User currentUser = userService.getCurrentUser();
    return ResponseEntity.ok(paperService.findSubmissionsForAuthor(currentUser.getId()));
  }

  @PutMapping("/revise/{id}")
  @PreAuthorize("hasAnyRole('AUTHOR','ADMIN')")
  public ResponseEntity<Paper> revisePaper(@PathVariable Long id, @Valid @RequestBody RevisionRequest request) {
    User currentUser = userService.getCurrentUser();
    return ResponseEntity.ok(paperService.submitRevision(id, currentUser.getId(), request.getRevisionNotes()));
  }

  @GetMapping("/all")
  @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
  public ResponseEntity<List<Paper>> allPapers() {
    return ResponseEntity.ok(paperService.findAll());
  }

  @PutMapping("/assign-reviewer/{paperId}/{reviewerId}")
  @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
  public ResponseEntity<Paper> assignReviewer(@PathVariable Long paperId, @PathVariable Long reviewerId) {
    return ResponseEntity.ok(paperService.assignReviewer(paperId, reviewerId));
  }

  @PutMapping("/decision/{id}")
  @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
  public ResponseEntity<Paper> updateDecision(@PathVariable Long id, @Valid @RequestBody PaperDecisionRequest request) {
    return ResponseEntity.ok(paperService.updateDecision(id, request.getStatus(), request.getFeedback()));
  }

  @GetMapping("/published")
  public ResponseEntity<List<Paper>> published() {
    return ResponseEntity.ok(paperService.findPublished());
  }

  @GetMapping("/download/{id}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<Resource> download(@PathVariable Long id) {
    Paper paper = paperService.getById(id);
    User currentUser = userService.getCurrentUser();
    if (!hasDownloadPermission(currentUser, paper)) {
      throw new AccessDeniedException("You do not have permission to view this paper");
    }
    if (!StringUtils.hasText(paper.getFilePath())) {
      throw new ResourceNotFoundException("Paper file is not available for download");
    }
    Resource resource = fileStorageService.load(paper.getFilePath());
    String safeTitle = sanitizeFilename(paper.getTitle());
    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_PDF)
        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + safeTitle + ".pdf\"")
        .body(resource);
  }

  private boolean hasDownloadPermission(User user, Paper paper) {
    Role role = user.getRole();
    if (role == Role.ADMIN || role == Role.EDITOR) {
      return true;
    }
    if (role == Role.AUTHOR && paper.getAuthor() != null) {
      return paper.getAuthor().getId().equals(user.getId());
    }
    return role == Role.REVIEWER
        && paper.getAssignedReviewer() != null
        && paper.getAssignedReviewer().getId().equals(user.getId());
  }

  private String sanitizeFilename(String original) {
    if (!StringUtils.hasText(original)) {
      return "paper";
    }
    return original.replaceAll("[^a-zA-Z0-9\\-_]", "_");
  }
}
