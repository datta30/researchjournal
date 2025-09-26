package com.journal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RevisionRequest {

  @NotBlank
  private String revisionNotes;
}
