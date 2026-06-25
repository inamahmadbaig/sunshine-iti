package com.sunshine.iti.controller;

import com.sunshine.iti.model.AdmissionDetail;
import com.sunshine.iti.model.FeePayment;
import com.sunshine.iti.repository.AdmissionDetailRepository;
import com.sunshine.iti.repository.FeePaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/fees")
@CrossOrigin(origins = "*")
public class FeePaymentController {

    @Autowired
    private FeePaymentRepository feePaymentRepository;

    @Autowired
    private AdmissionDetailRepository admissionDetailRepository;

    @Autowired
    private com.sunshine.iti.util.EmailHelper emailHelper;

    @GetMapping("/student/{admissionId}")
    public ResponseEntity<?> getStudentFees(@PathVariable Long admissionId) {
        Optional<AdmissionDetail> studentOpt = admissionDetailRepository.findById(admissionId);
        if (!studentOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        AdmissionDetail student = studentOpt.get();
        List<FeePayment> dbFees = feePaymentRepository.findByAdmissionDetailIdOrderByPaymentDateDesc(admissionId);
        List<FeePayment> fees = new java.util.ArrayList<>(dbFees);
        
        double sumOfFees = 0.0;
        for (FeePayment fee : fees) {
            if ("APPROVED".equals(fee.getStatus())) {
                sumOfFees += fee.getAmount();
            }
        }
        
        double studentAmountPaid = student.getAmountPaid() != null ? student.getAmountPaid() : 0.0;
        
        if (studentAmountPaid > sumOfFees) {
            double initialFee = studentAmountPaid - sumOfFees;
            FeePayment initialPayment = new FeePayment();
            initialPayment.setId(-1L);
            initialPayment.setAdmissionDetail(student);
            initialPayment.setAmount(initialFee);
            initialPayment.setPaymentMethod(student.getPaymentMethod() != null ? student.getPaymentMethod() : "N/A");
            initialPayment.setTransactionId(student.getTransactionId() != null ? student.getTransactionId() : "");
            
            LocalDateTime dateToUse = student.getPaymentDate() != null ? student.getPaymentDate().atStartOfDay() : 
                                      (student.getAppliedDate() != null ? student.getAppliedDate() : LocalDateTime.now());
            
            initialPayment.setPaymentDate(dateToUse);
            initialPayment.setStatus("APPROVED");
            initialPayment.setRemarks("Admission Time Fee");
            
            fees.add(initialPayment);
            fees.sort((f1, f2) -> f2.getPaymentDate().compareTo(f1.getPaymentDate()));
        }
        
        return ResponseEntity.ok(fees);
    }

    // Get all pending fee payments (for Admin Dashboard)
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingFees() {
        return ResponseEntity.ok(feePaymentRepository.findByStatusOrderBySubmittedAtDesc("PENDING"));
    }

    // Get all fee payments (for Admin Dashboard All Payments Log)
    @GetMapping
    public ResponseEntity<?> getAllFees() {
        return ResponseEntity.ok(feePaymentRepository.findAllByOrderBySubmittedAtDesc());
    }

    // Download receipt
    @GetMapping("/{id}/receipt")
    public ResponseEntity<byte[]> getReceipt(@PathVariable Long id) {
        Optional<FeePayment> feeOpt = feePaymentRepository.findById(id);
        if (feeOpt.isPresent() && feeOpt.get().getReceiptData() != null) {
            FeePayment fee = feeOpt.get();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fee.getReceiptName() + "\"")
                    .contentType(MediaType.parseMediaType(fee.getReceiptType()))
                    .body(fee.getReceiptData());
        }
        return ResponseEntity.notFound().build();
    }

    // Student submits a fee payment (goes to PENDING)
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> submitFeePayment(
            @RequestParam("admissionId") Long admissionId,
            @RequestParam("amount") Double amount,
            @RequestParam("paymentMethod") String paymentMethod,
            @RequestParam(value = "transactionId", required = false) String transactionId,
            @RequestParam("paymentDate") String paymentDateStr,
            @RequestParam(value = "receipt", required = false) MultipartFile receipt) {

        try {
            Optional<AdmissionDetail> admissionOpt = admissionDetailRepository.findById(admissionId);
            if (!admissionOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Student not found"));
            }

            FeePayment fee = new FeePayment();
            fee.setAdmissionDetail(admissionOpt.get());
            fee.setAmount(amount);
            fee.setPaymentMethod(paymentMethod);
            fee.setTransactionId(transactionId != null ? transactionId : "");
            fee.setPaymentDate(parseDate(paymentDateStr).atStartOfDay());
            fee.setStatus("PENDING");

            if (receipt != null && !receipt.isEmpty()) {
                fee.setReceiptData(receipt.getBytes());
                fee.setReceiptName(receipt.getOriginalFilename());
                fee.setReceiptType(receipt.getContentType());
            }

            FeePayment savedFee = feePaymentRepository.save(fee);

            try {
                AdmissionDetail student = admissionOpt.get();
                List<FeePayment> history = feePaymentRepository.findByAdmissionDetailIdOrderByPaymentDateDesc(student.getId());
                emailHelper.sendFeeUpdateEmail(student, savedFee, history);
            } catch (Exception e) {
                System.err.println("Failed to send fee submission email: " + e.getMessage());
            }

            return ResponseEntity.ok(savedFee);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    // Admin records a manual payment (goes straight to APPROVED and updates balance)
    @PostMapping(value = "/admin", consumes = {"multipart/form-data"})
    public ResponseEntity<?> recordManualPayment(
            @RequestParam("admissionId") Long admissionId,
            @RequestParam("amount") Double amount,
            @RequestParam("paymentMethod") String paymentMethod,
            @RequestParam(value = "transactionId", required = false) String transactionId,
            @RequestParam("paymentDate") String paymentDateStr,
            @RequestParam(value = "remarks", required = false) String remarks,
            @RequestParam(value = "receipt", required = false) MultipartFile receipt) {

        try {
            Optional<AdmissionDetail> admissionOpt = admissionDetailRepository.findById(admissionId);
            if (!admissionOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Student not found"));
            }

            AdmissionDetail student = admissionOpt.get();

            FeePayment fee = new FeePayment();
            fee.setAdmissionDetail(student);
            fee.setAmount(amount);
            fee.setPaymentMethod(paymentMethod);
            fee.setTransactionId(transactionId != null ? transactionId : "");
            fee.setPaymentDate(parseDate(paymentDateStr).atStartOfDay());
            fee.setRemarks(remarks);
            fee.setStatus("APPROVED"); // Directly approved

            if (receipt != null && !receipt.isEmpty()) {
                fee.setReceiptData(receipt.getBytes());
                fee.setReceiptName(receipt.getOriginalFilename());
                fee.setReceiptType(receipt.getContentType());
            }

            FeePayment savedFee = feePaymentRepository.save(fee);

            // Update student's balance
            double currentPaid = student.getAmountPaid() != null ? student.getAmountPaid() : 0.0;
            double courseFee = student.getCourseFee() != null ? student.getCourseFee() : 0.0;
            
            student.setAmountPaid(currentPaid + amount);
            student.setOutstandingBalance(courseFee - student.getAmountPaid());
            
            if (student.getOutstandingBalance() <= 0) {
                student.setPaymentStatus("COMPLETED");
            }
            
            admissionDetailRepository.save(student);

            try {
                List<FeePayment> history = feePaymentRepository.findByAdmissionDetailIdOrderByPaymentDateDesc(student.getId());
                emailHelper.sendFeeUpdateEmail(student, savedFee, history);
            } catch (Exception e) {
                System.err.println("Failed to send manual payment fee update email: " + e.getMessage());
            }

            return ResponseEntity.ok(savedFee);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    // Admin records a Certificate Fee
    @PostMapping(value = "/certificate")
    public ResponseEntity<?> recordCertificateFee(
            @RequestParam("admissionId") Long admissionId,
            @RequestParam("amount") Double amount,
            @RequestParam("paymentMethod") String paymentMethod,
            @RequestParam(value = "transactionId", required = false) String transactionId) {

        try {
            Optional<AdmissionDetail> admissionOpt = admissionDetailRepository.findById(admissionId);
            if (!admissionOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Student not found"));
            }

            AdmissionDetail student = admissionOpt.get();

            // Increase the total course fee by the certificate fee amount
            double currentCourseFee = student.getCourseFee() != null ? student.getCourseFee() : 0.0;
            student.setCourseFee(currentCourseFee + amount);

            FeePayment fee = new FeePayment();
            fee.setAdmissionDetail(student);
            fee.setAmount(amount);
            fee.setPaymentMethod(paymentMethod);
            fee.setTransactionId(transactionId != null ? transactionId : "");
            fee.setPaymentDate(LocalDate.now().atStartOfDay());
            fee.setRemarks("Certificate Fee");
            fee.setStatus("APPROVED");

            FeePayment savedFee = feePaymentRepository.save(fee);

            // Update student's balance
            double currentPaid = student.getAmountPaid() != null ? student.getAmountPaid() : 0.0;
            student.setAmountPaid(currentPaid + amount);
            student.setOutstandingBalance(student.getCourseFee() - student.getAmountPaid());
            
            admissionDetailRepository.save(student);

            try {
                List<FeePayment> history = feePaymentRepository.findByAdmissionDetailIdOrderByPaymentDateDesc(student.getId());
                emailHelper.sendFeeUpdateEmail(student, savedFee, history);
            } catch (Exception e) {
                System.err.println("Failed to send certificate fee update email: " + e.getMessage());
            }

            return ResponseEntity.ok(Map.of("message", "Certificate fee recorded successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    // Admin approves or rejects a pending payment
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<FeePayment> feeOpt = feePaymentRepository.findById(id);
        if (!feeOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        FeePayment fee = feeOpt.get();
        String newStatus = body.get("status");
        String remarks = body.get("remarks");

        if ("APPROVED".equals(newStatus) && !"APPROVED".equals(fee.getStatus())) {
            // Apply payment to student balance
            AdmissionDetail student = fee.getAdmissionDetail();
            double currentPaid = student.getAmountPaid() != null ? student.getAmountPaid() : 0.0;
            double courseFee = student.getCourseFee() != null ? student.getCourseFee() : 0.0;
            
            student.setAmountPaid(currentPaid + fee.getAmount());
            student.setOutstandingBalance(courseFee - student.getAmountPaid());
            
            if (student.getOutstandingBalance() <= 0) {
                student.setPaymentStatus("COMPLETED");
            } else {
                student.setPaymentStatus("PENDING");
            }
            admissionDetailRepository.save(student);
        } else if (!"APPROVED".equals(newStatus) && "APPROVED".equals(fee.getStatus())) {
            // Revert payment from student balance
            AdmissionDetail student = fee.getAdmissionDetail();
            double currentPaid = student.getAmountPaid() != null ? student.getAmountPaid() : 0.0;
            double courseFee = student.getCourseFee() != null ? student.getCourseFee() : 0.0;
            
            student.setAmountPaid(Math.max(0.0, currentPaid - fee.getAmount()));
            student.setOutstandingBalance(courseFee - student.getAmountPaid());
            
            if (student.getOutstandingBalance() <= 0) {
                student.setPaymentStatus("COMPLETED");
            } else {
                student.setPaymentStatus("PENDING");
            }
            admissionDetailRepository.save(student);
        }

        fee.setStatus(newStatus);
        if (remarks != null) {
            fee.setRemarks(remarks);
        }
        
        FeePayment savedFee = feePaymentRepository.save(fee);

        try {
            AdmissionDetail student = savedFee.getAdmissionDetail();
            List<FeePayment> history = feePaymentRepository.findByAdmissionDetailIdOrderByPaymentDateDesc(student.getId());
            emailHelper.sendFeeUpdateEmail(student, savedFee, history);
        } catch (Exception e) {
            System.err.println("Failed to send fee status update email: " + e.getMessage());
        }
        
        return ResponseEntity.ok(savedFee);
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(dateStr); // Try yyyy-MM-dd first
        } catch (Exception e) {
            try {
                // Try dd/MM/yyyy or d/M/yyyy
                java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("[dd][d]/[MM][M]/yyyy");
                return LocalDate.parse(dateStr, formatter);
            } catch (Exception ex) {
                try {
                    // Try MM/dd/yyyy
                    java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("[MM][M]/[dd][d]/yyyy");
                    return LocalDate.parse(dateStr, formatter);
                } catch (Exception ex2) {
                    System.err.println("Failed to parse date: " + dateStr);
                    return null;
                }
            }
        }
    }
}
