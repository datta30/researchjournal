package com.journal.dto;

import com.journal.model.enums.ReviewDecision;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewSubmitRequest {

  @NotNull
  private ReviewDecision decision;

  @NotBlank
  private String comments;
}
