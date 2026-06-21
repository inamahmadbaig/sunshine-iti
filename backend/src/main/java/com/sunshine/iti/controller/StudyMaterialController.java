package com.sunshine.iti.controller;

import com.sunshine.iti.model.StudyMaterial;
import com.sunshine.iti.repository.StudyMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/study-materials")
@CrossOrigin(origins = "*")
public class StudyMaterialController {

    @Autowired
    private StudyMaterialRepository repo;

    // GET all materials (optionally filter by type)
    @GetMapping
    public List<StudyMaterial> getAll(@RequestParam(required = false) String type) {
        if (type != null && !type.isEmpty()) {
            return repo.findByTypeOrderByUploadedAtDesc(type);
        }
        return repo.findAllByOrderByUploadedAtDesc();
    }

    // POST - upload a new study material
    @PostMapping
    public ResponseEntity<?> upload(
            @RequestParam("title") String title,
            @RequestParam(value = "titleHn", required = false) String titleHn,
            @RequestParam("trade") String trade,
            @RequestParam(value = "tradeHn", required = false) String tradeHn,
            @RequestParam("type") String type,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "descriptionHn", required = false) String descriptionHn,
            @RequestParam("file") MultipartFile file) {
        try {
            StudyMaterial material = new StudyMaterial();
            material.setTitle(title);
            material.setTitleHn(titleHn);
            material.setTrade(trade);
            material.setTradeHn(tradeHn);
            material.setType(type);
            material.setDescription(description);
            material.setDescriptionHn(descriptionHn);
            material.setFileName(file.getOriginalFilename());
            material.setFileType(file.getContentType());
            material.setFileData(file.getBytes());
            repo.save(material);

            // Return a lightweight response (no fileData bytes)
            Map<String, Object> resp = new LinkedHashMap<>();
            resp.put("id", material.getId());
            resp.put("title", material.getTitle());
            resp.put("titleHn", material.getTitleHn());
            resp.put("trade", material.getTrade());
            resp.put("tradeHn", material.getTradeHn());
            resp.put("type", material.getType());
            resp.put("description", material.getDescription());
            resp.put("descriptionHn", material.getDescriptionHn());
            resp.put("fileName", material.getFileName());
            resp.put("uploadedAt", material.getUploadedAt());
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
        }
    }

    // GET - download a specific file
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        Optional<StudyMaterial> opt = repo.findById(id);
        if (!opt.isPresent()) return ResponseEntity.notFound().build();

        StudyMaterial m = opt.get();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + m.getFileName() + "\"");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        return new ResponseEntity<>(m.getFileData(), headers, HttpStatus.OK);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }
}
