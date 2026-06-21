package com.sunshine.iti.controller;

import com.sunshine.iti.model.AdmissionDetail;
import com.sunshine.iti.model.ExamResult;
import com.sunshine.iti.repository.AdmissionDetailRepository;
import com.sunshine.iti.repository.ExamResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ExamResultController {

    @Autowired
    private ExamResultRepository examResultRepository;

    @Autowired
    private AdmissionDetailRepository admissionDetailRepository;

    @GetMapping("/student/{admissionId}")
    public List<ExamResult> getResultsByStudent(@PathVariable Long admissionId) {
        return examResultRepository.findByAdmissionDetailIdOrderBySemesterOrYearDesc(admissionId);
    }

    @PostMapping("/student/{admissionId}")
    public ResponseEntity<?> addResult(@PathVariable Long admissionId, @RequestBody ExamResult result) {
        Optional<AdmissionDetail> admissionOpt = admissionDetailRepository.findById(admissionId);
        if (!admissionOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }
        
        result.setAdmissionDetail(admissionOpt.get());
        ExamResult savedResult = examResultRepository.save(result);
        return ResponseEntity.ok(savedResult);
    }

    @DeleteMapping("/{id}")
    public void deleteResult(@PathVariable Long id) {
        examResultRepository.deleteById(id);
    }
}
