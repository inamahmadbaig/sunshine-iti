package com.sunshine.iti.controller;

import com.sunshine.iti.model.Inquiry;
import com.sunshine.iti.repository.InquiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inquiries")
@CrossOrigin(origins = "*")
public class InquiryController {

    @Autowired
    private InquiryRepository inquiryRepository;

    @GetMapping
    public List<Inquiry> getAllInquiries() {
        return inquiryRepository.findAll();
    }

    @PostMapping
    public Inquiry createInquiry(@RequestBody Inquiry inquiry) {
        inquiry.setDate(LocalDateTime.now());
        inquiry.setStatus("UNREAD");
        return inquiryRepository.save(inquiry);
    }

    @PatchMapping("/{id}/status")
    public Inquiry updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Inquiry inquiry = inquiryRepository.findById(id).orElseThrow(() -> new RuntimeException("Inquiry not found"));
        inquiry.setStatus(body.get("status"));
        return inquiryRepository.save(inquiry);
    }

    @DeleteMapping("/{id}")
    public void deleteInquiry(@PathVariable Long id) {
        inquiryRepository.deleteById(id);
    }
}
