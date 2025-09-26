package com.journal.repository;

import com.journal.model.PlagiarismReport;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlagiarismReportRepository extends JpaRepository<PlagiarismReport, Long> {

  Optional<PlagiarismReport> findByPaperId(Long paperId);
}
