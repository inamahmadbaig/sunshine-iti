package com.sunshine.iti.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    @Autowired
    private Cloudinary cloudinary;

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile multipartFile) throws IOException {
        String originalFileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());

        if (originalFileName == null || originalFileName.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid file name"));
        }

        String lowerCaseName = originalFileName.toLowerCase();
        if (!lowerCaseName.endsWith(".jpg") && !lowerCaseName.endsWith(".jpeg") && 
            !lowerCaseName.endsWith(".png") && !lowerCaseName.endsWith(".pdf")) {
            return ResponseEntity.badRequest().body(Map.of("error", "File type not allowed. Only JPG, PNG, and PDF are supported."));
        }

        try {
            // Upload to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(multipartFile.getBytes(), ObjectUtils.asMap(
                    "folder", "iti-college",
                    "resource_type", "auto" // Auto detects image/raw file
            ));

            String fileUrl = uploadResult.get("secure_url").toString();

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            return new ResponseEntity<>(response, HttpStatus.OK);
            
        } catch (IOException e) {
            throw new IOException("Could not upload file to Cloudinary: " + originalFileName, e);
        }
    }
}
