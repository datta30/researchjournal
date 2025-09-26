package com.journal.service.impl;

import com.journal.exception.BadRequestException;
import com.journal.service.FileStorageService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileSystemStorageService implements FileStorageService {

  private final Path rootLocation;

  public FileSystemStorageService(@Value("${app.upload-dir}") String uploadDir) {
    this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    try {
      Files.createDirectories(rootLocation);
    } catch (IOException e) {
      throw new BadRequestException("Could not initialize storage");
    }
  }

  @Override
  public String store(MultipartFile file) {
    if (file.isEmpty()) {
      throw new BadRequestException("Cannot store empty file");
    }
    String filename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
    String extension = filename.contains(".") ? filename.substring(filename.lastIndexOf('.')) : "";
    String storedName = UUID.randomUUID() + extension;
    try {
      Path destinationFile = rootLocation.resolve(storedName).normalize();
      Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
      return storedName;
    } catch (IOException e) {
      throw new BadRequestException("Failed to store file");
    }
  }

  @Override
  public Resource load(String filePath) {
    try {
      Path file = rootLocation.resolve(filePath).normalize();
      Resource resource = new UrlResource(file.toUri());
      if (resource.exists() && resource.isReadable()) {
        return resource;
      }
      throw new BadRequestException("File not found");
    } catch (Exception e) {
      throw new BadRequestException("Could not read file");
    }
  }
}
