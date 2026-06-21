package com.sunshine.iti.controller;

import com.sunshine.iti.model.AdmissionApplication;
import com.sunshine.iti.repository.AdmissionApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class AdmissionApplicationController {

    @Autowired
    private AdmissionApplicationRepository applicationRepository;

    @GetMapping
    public List<AdmissionApplication> getAllApplications() {
        return applicationRepository.findAll();
    }

    @PostMapping
    public AdmissionApplication submitApplication(@RequestBody AdmissionApplication application) {
        application.setAppliedDate(LocalDateTime.now());
        return applicationRepository.save(application);
    }
}
