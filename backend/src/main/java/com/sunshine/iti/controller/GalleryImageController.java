package com.sunshine.iti.controller;

import com.sunshine.iti.model.GalleryImage;
import com.sunshine.iti.repository.GalleryImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = "*")
public class GalleryImageController {

    @Autowired
    private GalleryImageRepository galleryImageRepository;

    @GetMapping
    public List<GalleryImage> getAllImages() {
        return galleryImageRepository.findAll(Sort.by(Sort.Direction.DESC, "uploadedAt"));
    }

    @GetMapping("/category/{category}")
    public List<GalleryImage> getImagesByCategory(@PathVariable String category) {
        return galleryImageRepository.findByCategoryOrderByUploadedAtDesc(category);
    }

    @PostMapping
    public GalleryImage addImage(@RequestBody GalleryImage image) {
        return galleryImageRepository.save(image);
    }

    @DeleteMapping("/{id}")
    public void deleteImage(@PathVariable Long id) {
        galleryImageRepository.deleteById(id);
    }
}
