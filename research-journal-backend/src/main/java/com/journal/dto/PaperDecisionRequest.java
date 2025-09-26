package com.journal.dto;

import com.journal.model.enums.PaperStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaperDecisionRequest {

  @NotNull
  private PaperStatus status;

  private String feedback;
}
