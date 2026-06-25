package com.sunshine.iti.controller;

import com.sunshine.iti.model.AdmissionDetail;
import com.sunshine.iti.repository.AdmissionDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admissions")
@CrossOrigin(origins = "*")
public class AdmissionDetailController {

    @Autowired
    private AdmissionDetailRepository admissionDetailRepository;

    @Autowired
    private com.sunshine.iti.util.EmailHelper emailHelper;

    @Autowired
    private Cloudinary cloudinary;

    private String uploadToCloudinary(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "iti-college",
                    "resource_type", "auto"
            ));
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            System.err.println("Cloudinary upload failed: " + e.getMessage());
            return null;
        }
    }

    private double getCourseFeeForTrade(String trade) {
        if (trade == null) return 0.0;
        switch (trade.toUpperCase()) {
            case "ELECTRICIAN": return 30000.0;
            case "FITTER": return 30000.0;
            case "COPA": return 15000.0;
            case "WELDER": return 18000.0;
            case "DIESEL MECHANIC": return 20000.0;
            case "DCA": return 11000.0;
            case "PGDCA": return 12000.0;
            case "HSI":
            case "HEALTH SANITARY INSPECTOR": return 28000.0;
            default: return 0.0;
        }
    }


    @GetMapping
    public List<AdmissionDetail> getAllAdmissions() {
        return admissionDetailRepository.findAll();
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchAdmission(
            @RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "dob") String dobStr,
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "mobile", required = false) String mobile) {
        
        LocalDate dob = parseDate(dobStr);
        if (dob == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format. Use YYYY-MM-DD"));
        }

        if (id != null) {
            Optional<AdmissionDetail> studentOpt = admissionDetailRepository.findByIdAndDob(id, dob);
            if (studentOpt.isPresent()) {
                return ResponseEntity.ok(studentOpt.get());
            }
        } else if (mobile != null && (fullName == null || fullName.trim().isEmpty())) {
            Optional<AdmissionDetail> studentOpt = admissionDetailRepository.findByMobileAndDob(mobile.trim(), dob);
            if (studentOpt.isPresent()) {
                return ResponseEntity.ok(studentOpt.get());
            }
        } else if (fullName != null && mobile != null) {
            Optional<AdmissionDetail> studentOpt = admissionDetailRepository.findByFullNameIgnoreCaseAndMobileAndDob(
                fullName.trim(), mobile.trim(), dob
            );
            if (studentOpt.isPresent()) {
                return ResponseEntity.ok(studentOpt.get());
            }
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "No record found with the provided details."));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public AdmissionDetail submitAdmission(@ModelAttribute AdmissionFormDto dto) throws IOException {
        AdmissionDetail detail = new AdmissionDetail();
        
        detail.setTrade(dto.getTrade());
        detail.setFullName(dto.getFullName());
        detail.setFatherName(dto.getFatherName());
        detail.setMotherName(dto.getMotherName());
        detail.setAadharNo(dto.getAadharNo());
        detail.setSamagraId(dto.getSamagraId());
        
        if (dto.getDob() != null && !dto.getDob().isEmpty()) {
            detail.setDob(parseDate(dto.getDob()));
        }
        
        detail.setCategory(dto.getCategory());
        detail.setGender(dto.getGender());
        detail.setReligion(dto.getReligion());
        detail.setBloodGroup(dto.getBloodGroup());
        detail.setAnnualIncome(dto.getAnnualIncome());
        detail.setIsPH(dto.getIsPH());

        detail.setAddress(dto.getAddress());
        detail.setPost(dto.getPost());
        detail.setTehsil(dto.getTehsil());
        detail.setDistt(dto.getDistt());
        detail.setState(dto.getState());
        detail.setPin(dto.getPin());
        detail.setMobile(dto.getMobile());
        detail.setParentMobile(dto.getParentMobile());
        detail.setWhatsapp(dto.getWhatsapp());
        detail.setEmail(dto.getEmail());

        detail.setTenthBoard(dto.getTenthBoard());
        detail.setTenthSchool(dto.getTenthSchool());
        detail.setTenthRollNo(dto.getTenthRollNo());
        detail.setTenthYear(dto.getTenthYear());
        detail.setTenthTotalMarks(dto.getTenthTotalMarks());
        detail.setTenthMarksObt(dto.getTenthMarksObt());

        detail.setTwelfthBoard(dto.getTwelfthBoard());
        detail.setTwelfthSchool(dto.getTwelfthSchool());
        detail.setTwelfthRollNo(dto.getTwelfthRollNo());
        detail.setTwelfthYear(dto.getTwelfthYear());
        detail.setTwelfthTotalMarks(dto.getTwelfthTotalMarks());
        detail.setTwelfthMarksObt(dto.getTwelfthMarksObt());

        detail.setStatus("PENDING");
        detail.setAppliedDate(LocalDateTime.now());

        // Set payment details
        detail.setPaymentMethod(dto.getPaymentMethod());
        detail.setTransactionId(dto.getTransactionId());
        double paidVal = dto.getAmountPaid() != null ? dto.getAmountPaid() : 0.0;
        if (paidVal < 0.0) {
            paidVal = 0.0;
        }
        detail.setAmountPaid(paidVal);
        if (dto.getPaymentDate() != null && !dto.getPaymentDate().isEmpty()) {
            detail.setPaymentDate(parseDate(dto.getPaymentDate()));
        } else {
            detail.setPaymentDate(LocalDate.now());
        }
        double courseFee = dto.getCourseFee() != null ? dto.getCourseFee() : getCourseFeeForTrade(dto.getTrade());
        detail.setCourseFee(courseFee);
        detail.setOutstandingBalance(courseFee - detail.getAmountPaid());
        detail.setPaymentStatus(detail.getAmountPaid() >= courseFee ? "COMPLETED" : "PENDING");


        // Upload files to Cloudinary and store URLs
        if (dto.getPhoto() != null && !dto.getPhoto().isEmpty()) {
            detail.setPhotoUrl(uploadToCloudinary(dto.getPhoto()));
        }
        if (dto.getSignature() != null && !dto.getSignature().isEmpty()) {
            detail.setSignatureUrl(uploadToCloudinary(dto.getSignature()));
        }
        if (dto.getTenthDocument() != null && !dto.getTenthDocument().isEmpty()) {
            detail.setTenthDocUrl(uploadToCloudinary(dto.getTenthDocument()));
        }
        if (dto.getTwelfthDocument() != null && !dto.getTwelfthDocument().isEmpty()) {
            detail.setTwelfthDocUrl(uploadToCloudinary(dto.getTwelfthDocument()));
        }
        if (dto.getAadharDocument() != null && !dto.getAadharDocument().isEmpty()) {
            detail.setAadharDocUrl(uploadToCloudinary(dto.getAadharDocument()));
        }
        if (dto.getSamagraDocument() != null && !dto.getSamagraDocument().isEmpty()) {
            detail.setSamagraDocUrl(uploadToCloudinary(dto.getSamagraDocument()));
        }
        if (dto.getCasteDocument() != null && !dto.getCasteDocument().isEmpty()) {
            detail.setCasteDocUrl(uploadToCloudinary(dto.getCasteDocument()));
        }
        if (dto.getIncomeDocument() != null && !dto.getIncomeDocument().isEmpty()) {
            detail.setIncomeDocUrl(uploadToCloudinary(dto.getIncomeDocument()));
        }
        if (dto.getDomicileDocument() != null && !dto.getDomicileDocument().isEmpty()) {
            detail.setDomicileDocUrl(uploadToCloudinary(dto.getDomicileDocument()));
        }
        if (dto.getPaymentReceipt() != null && !dto.getPaymentReceipt().isEmpty()) {
            detail.setPaymentReceiptUrl(uploadToCloudinary(dto.getPaymentReceipt()));
        }

        AdmissionDetail saved = admissionDetailRepository.save(detail);
        try {
            emailHelper.sendPendingEmail(saved);
        } catch (Exception e) {
            System.err.println("Email sending failed: " + e.getMessage());
        }
        return saved;
    }

    // Serves / streams file bytes back to browser
    @GetMapping("/{id}/files/{fieldName}")
    public ResponseEntity<byte[]> getFile(@PathVariable Long id, @PathVariable String fieldName) {
        Optional<AdmissionDetail> detailOpt = admissionDetailRepository.findById(id);
        if (!detailOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        AdmissionDetail detail = detailOpt.get();
        byte[] data = null;
        String contentType = "application/octet-stream";
        String name = "file";

        switch (fieldName) {
            case "photo":
                data = detail.getPhotoData();
                contentType = detail.getPhotoType();
                name = detail.getPhotoName();
                break;
            case "signature":
                data = detail.getSignatureData();
                contentType = detail.getSignatureType();
                name = detail.getSignatureName();
                break;
            case "tenthDocument":
                data = detail.getTenthDocData();
                contentType = detail.getTenthDocType();
                name = detail.getTenthDocName();
                break;
            case "twelfthDocument":
                data = detail.getTwelfthDocData();
                contentType = detail.getTwelfthDocType();
                name = detail.getTwelfthDocName();
                break;
            case "aadharDocument":
                data = detail.getAadharDocData();
                contentType = detail.getAadharDocType();
                name = detail.getAadharDocName();
                break;
            case "samagraDocument":
                data = detail.getSamagraDocData();
                contentType = detail.getSamagraDocType();
                name = detail.getSamagraDocName();
                break;
            case "casteDocument":
                data = detail.getCasteDocData();
                contentType = detail.getCasteDocType();
                name = detail.getCasteDocName();
                break;
            case "incomeDocument":
                data = detail.getIncomeDocData();
                contentType = detail.getIncomeDocType();
                name = detail.getIncomeDocName();
                break;
            case "domicileDocument":
                data = detail.getDomicileDocData();
                contentType = detail.getDomicileDocType();
                name = detail.getDomicileDocName();
                break;
            case "paymentReceipt":
                data = detail.getPaymentReceiptData();
                contentType = detail.getPaymentReceiptType();
                name = detail.getPaymentReceiptName();
                break;
        }

        if (data == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + name + "\"")
                .body(data);
    }

    @PutMapping("/{id}")
    public AdmissionDetail updateAdmission(@PathVariable Long id, @RequestBody AdmissionDetail detail) {
        Optional<AdmissionDetail> existingOpt = admissionDetailRepository.findById(id);
        if (existingOpt.isPresent()) {
            AdmissionDetail existing = existingOpt.get();
            existing.setTrade(detail.getTrade());
            existing.setFullName(detail.getFullName());
            existing.setFatherName(detail.getFatherName());
            existing.setMotherName(detail.getMotherName());
            existing.setAadharNo(detail.getAadharNo());
            existing.setSamagraId(detail.getSamagraId());
            existing.setDob(detail.getDob());
            existing.setCategory(detail.getCategory());
            existing.setGender(detail.getGender());
            existing.setReligion(detail.getReligion());
            existing.setBloodGroup(detail.getBloodGroup());
            existing.setAnnualIncome(detail.getAnnualIncome());
            existing.setIsPH(detail.getIsPH());
            existing.setAddress(detail.getAddress());
            existing.setPost(detail.getPost());
            existing.setTehsil(detail.getTehsil());
            existing.setDistt(detail.getDistt());
            existing.setState(detail.getState());
            existing.setPin(detail.getPin());
            existing.setMobile(detail.getMobile());
            existing.setParentMobile(detail.getParentMobile());
            existing.setWhatsapp(detail.getWhatsapp());
            existing.setEmail(detail.getEmail());
            existing.setTenthBoard(detail.getTenthBoard());
            existing.setTenthSchool(detail.getTenthSchool());
            existing.setTenthRollNo(detail.getTenthRollNo());
            existing.setTenthYear(detail.getTenthYear());
            existing.setTenthTotalMarks(detail.getTenthTotalMarks());
            existing.setTenthMarksObt(detail.getTenthMarksObt());
            existing.setTwelfthBoard(detail.getTwelfthBoard());
            existing.setTwelfthSchool(detail.getTwelfthSchool());
            existing.setTwelfthRollNo(detail.getTwelfthRollNo());
            existing.setTwelfthYear(detail.getTwelfthYear());
            existing.setTwelfthTotalMarks(detail.getTwelfthTotalMarks());
            existing.setTwelfthMarksObt(detail.getTwelfthMarksObt());
            
            existing.setPaymentMethod(detail.getPaymentMethod());
            existing.setTransactionId(detail.getTransactionId());
            double updatePaidVal = detail.getAmountPaid() != null ? detail.getAmountPaid() : 0.0;
            if (updatePaidVal < 0.0) {
                updatePaidVal = 0.0;
            }
            existing.setAmountPaid(updatePaidVal);
            existing.setPaymentStatus(detail.getPaymentStatus());
            if (detail.getPaymentDate() != null) {
                existing.setPaymentDate(detail.getPaymentDate());
            }
            if (detail.getCourseFee() != null) {
                existing.setCourseFee(detail.getCourseFee());
            } else {
                existing.setCourseFee(getCourseFeeForTrade(detail.getTrade()));
            }
            double paid = existing.getAmountPaid() != null ? existing.getAmountPaid() : 0.0;
            existing.setOutstandingBalance(existing.getCourseFee() - paid);
            existing.setAdminRemarks(detail.getAdminRemarks());

            return admissionDetailRepository.save(existing);
        }
        return null;
    }
    @PostMapping(value = "/{id}/update", consumes = {"multipart/form-data"})
    public AdmissionDetail fullUpdateAdmission(@PathVariable Long id, @ModelAttribute AdmissionFormDto dto) throws IOException {
        Optional<AdmissionDetail> existingOpt = admissionDetailRepository.findById(id);
        if (existingOpt.isPresent()) {
            AdmissionDetail existing = existingOpt.get();

            // Text Fields
            if (dto.getTrade() != null) existing.setTrade(dto.getTrade());
            if (dto.getFullName() != null) existing.setFullName(dto.getFullName());
            if (dto.getFatherName() != null) existing.setFatherName(dto.getFatherName());
            if (dto.getMotherName() != null) existing.setMotherName(dto.getMotherName());
            if (dto.getAadharNo() != null) existing.setAadharNo(dto.getAadharNo());
            if (dto.getSamagraId() != null) existing.setSamagraId(dto.getSamagraId());
            if (dto.getDob() != null && !dto.getDob().isEmpty()) existing.setDob(parseDate(dto.getDob()));
            if (dto.getCategory() != null) existing.setCategory(dto.getCategory());
            if (dto.getGender() != null) existing.setGender(dto.getGender());
            if (dto.getReligion() != null) existing.setReligion(dto.getReligion());
            if (dto.getBloodGroup() != null) existing.setBloodGroup(dto.getBloodGroup());
            if (dto.getAnnualIncome() != null) existing.setAnnualIncome(dto.getAnnualIncome());
            if (dto.getIsPH() != null) existing.setIsPH(dto.getIsPH());

            if (dto.getAddress() != null) existing.setAddress(dto.getAddress());
            if (dto.getPost() != null) existing.setPost(dto.getPost());
            if (dto.getTehsil() != null) existing.setTehsil(dto.getTehsil());
            if (dto.getDistt() != null) existing.setDistt(dto.getDistt());
            if (dto.getState() != null) existing.setState(dto.getState());
            if (dto.getPin() != null) existing.setPin(dto.getPin());
            if (dto.getMobile() != null) existing.setMobile(dto.getMobile());
            if (dto.getParentMobile() != null) existing.setParentMobile(dto.getParentMobile());
            if (dto.getWhatsapp() != null) existing.setWhatsapp(dto.getWhatsapp());
            if (dto.getEmail() != null) existing.setEmail(dto.getEmail());

            if (dto.getTenthBoard() != null) existing.setTenthBoard(dto.getTenthBoard());
            if (dto.getTenthSchool() != null) existing.setTenthSchool(dto.getTenthSchool());
            if (dto.getTenthRollNo() != null) existing.setTenthRollNo(dto.getTenthRollNo());
            if (dto.getTenthYear() != null) existing.setTenthYear(dto.getTenthYear());
            if (dto.getTenthTotalMarks() != null) existing.setTenthTotalMarks(dto.getTenthTotalMarks());
            if (dto.getTenthMarksObt() != null) existing.setTenthMarksObt(dto.getTenthMarksObt());

            if (dto.getTwelfthBoard() != null) existing.setTwelfthBoard(dto.getTwelfthBoard());
            if (dto.getTwelfthSchool() != null) existing.setTwelfthSchool(dto.getTwelfthSchool());
            if (dto.getTwelfthRollNo() != null) existing.setTwelfthRollNo(dto.getTwelfthRollNo());
            if (dto.getTwelfthYear() != null) existing.setTwelfthYear(dto.getTwelfthYear());
            if (dto.getTwelfthTotalMarks() != null) existing.setTwelfthTotalMarks(dto.getTwelfthTotalMarks());
            if (dto.getTwelfthMarksObt() != null) existing.setTwelfthMarksObt(dto.getTwelfthMarksObt());

            // Files (upload to Cloudinary if provided)
            if (dto.getPhoto() != null && !dto.getPhoto().isEmpty()) {
                existing.setPhotoUrl(uploadToCloudinary(dto.getPhoto()));
            }
            if (dto.getSignature() != null && !dto.getSignature().isEmpty()) {
                existing.setSignatureUrl(uploadToCloudinary(dto.getSignature()));
            }
            if (dto.getTenthDocument() != null && !dto.getTenthDocument().isEmpty()) {
                existing.setTenthDocUrl(uploadToCloudinary(dto.getTenthDocument()));
            }
            if (dto.getTwelfthDocument() != null && !dto.getTwelfthDocument().isEmpty()) {
                existing.setTwelfthDocUrl(uploadToCloudinary(dto.getTwelfthDocument()));
            }
            if (dto.getAadharDocument() != null && !dto.getAadharDocument().isEmpty()) {
                existing.setAadharDocUrl(uploadToCloudinary(dto.getAadharDocument()));
            }
            if (dto.getSamagraDocument() != null && !dto.getSamagraDocument().isEmpty()) {
                existing.setSamagraDocUrl(uploadToCloudinary(dto.getSamagraDocument()));
            }
            if (dto.getCasteDocument() != null && !dto.getCasteDocument().isEmpty()) {
                existing.setCasteDocUrl(uploadToCloudinary(dto.getCasteDocument()));
            }
            if (dto.getIncomeDocument() != null && !dto.getIncomeDocument().isEmpty()) {
                existing.setIncomeDocUrl(uploadToCloudinary(dto.getIncomeDocument()));
            }
            if (dto.getDomicileDocument() != null && !dto.getDomicileDocument().isEmpty()) {
                existing.setDomicileDocUrl(uploadToCloudinary(dto.getDomicileDocument()));
            }
            if (dto.getPaymentReceipt() != null && !dto.getPaymentReceipt().isEmpty()) {
                existing.setPaymentReceiptUrl(uploadToCloudinary(dto.getPaymentReceipt()));
            }

            return admissionDetailRepository.save(existing);
        }
        return null;
    }

    @PutMapping("/{id}/status")
    public AdmissionDetail updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<AdmissionDetail> existingOpt = admissionDetailRepository.findById(id);
        if (existingOpt.isPresent()) {
            AdmissionDetail existing = existingOpt.get();
            String oldStatus = existing.getStatus();
            String newStatus = body.get("status");
            existing.setStatus(newStatus);
            
            if ("APPROVED".equals(newStatus)) {
                double fee = existing.getCourseFee() != null ? existing.getCourseFee() : 0.0;
                double paid = existing.getAmountPaid() != null ? existing.getAmountPaid() : 0.0;
                existing.setOutstandingBalance(fee - paid);
                existing.setPaymentStatus(paid >= fee ? "COMPLETED" : "PENDING");
            }
            
            AdmissionDetail saved = admissionDetailRepository.save(existing);

            if ("APPROVED".equals(newStatus) && !"APPROVED".equals(oldStatus)) {
                try {
                    emailHelper.sendApprovalEmail(saved);
                } catch (Exception e) {
                    System.err.println("Failed to send approval email: " + e.getMessage());
                }
            }
            return saved;
        }
        return null;
    }

    @PutMapping("/{id}/payment")
    public AdmissionDetail updatePayment(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Optional<AdmissionDetail> existingOpt = admissionDetailRepository.findById(id);
        if (existingOpt.isPresent()) {
            AdmissionDetail existing = existingOpt.get();
            if (body.containsKey("amountPaid")) {
                double paidVal = Double.parseDouble(body.get("amountPaid").toString());
                if (paidVal < 0.0) {
                    paidVal = 0.0;
                }
                existing.setAmountPaid(paidVal);
            }
            if (body.containsKey("paymentStatus")) {
                existing.setPaymentStatus((String) body.get("paymentStatus"));
            }
            if (body.containsKey("transactionId")) {
                existing.setTransactionId((String) body.get("transactionId"));
            }
            if (body.containsKey("paymentMethod")) {
                existing.setPaymentMethod((String) body.get("paymentMethod"));
            }
            if (body.containsKey("courseFee")) {
                double courseFeeVal = Double.parseDouble(body.get("courseFee").toString());
                if (courseFeeVal < 0.0) {
                    courseFeeVal = 0.0;
                }
                existing.setCourseFee(courseFeeVal);
            }
            // Recalculate outstanding balance
            double fee = existing.getCourseFee() != null ? existing.getCourseFee() : 0.0;
            double paid = existing.getAmountPaid() != null ? existing.getAmountPaid() : 0.0;
            existing.setOutstandingBalance(fee - paid);
            if (paid >= fee) {
                existing.setPaymentStatus("COMPLETED");
            }
            if (body.containsKey("adminRemarks")) {
                existing.setAdminRemarks((String) body.get("adminRemarks"));
            }
            return admissionDetailRepository.save(existing);
        }
        return null;
    }

    @PostMapping("/{id}/send-receipt")
    public ResponseEntity<?> sendReceiptEmail(@PathVariable Long id) {
        Optional<AdmissionDetail> existingOpt = admissionDetailRepository.findById(id);
        if (existingOpt.isPresent()) {
            AdmissionDetail existing = existingOpt.get();
            try {
                emailHelper.sendApprovalEmail(existing);
                return ResponseEntity.ok(Map.of("message", "Receipt emailed successfully"));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to send email"));
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Application not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdmission(@PathVariable Long id) {
        if (admissionDetailRepository.existsById(id)) {
            admissionDetailRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Application deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Application not found"));
    }

    @GetMapping("/bulk-upload/template")
    public ResponseEntity<byte[]> getBulkUploadTemplate() {
        String csvContent = "FullName,FatherName,DOB(YYYY-MM-DD),Mobile,Trade,CourseFee,AmountPaid,PaymentMethod,TransactionId,AppliedDate(YYYY-MM-DD)\n"
                + "John Doe,Richard Doe,2005-01-15,9876543210,ELECTRICIAN,30000,10000,Cash,TXN123,2026-06-01\n";
        byte[] data = csvContent.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "text/csv")
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Bulk_Upload_Template.csv\"")
                .body(data);
    }

    @PostMapping(value = "/bulk-upload", consumes = {"multipart/form-data"})
    public ResponseEntity<?> bulkUploadAdmissions(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please upload a valid CSV file"));
        }
        
        List<AdmissionDetail> toSave = new java.util.ArrayList<>();
        int successCount = 0;
        int errorCount = 0;
        
        try (java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(file.getInputStream(), java.nio.charset.StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true;
            while ((line = reader.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue; // skip header
                }
                
                String[] columns = line.split(",", -1);
                if (columns.length < 5) {
                    errorCount++;
                    continue; // Skip invalid lines
                }
                
                try {
                    AdmissionDetail detail = new AdmissionDetail();
                    detail.setFullName(columns[0].trim());
                    detail.setFatherName(columns[1].trim());
                    detail.setDob(parseDate(columns[2].trim()));
                    detail.setMobile(columns[3].trim());
                    detail.setTrade(columns[4].trim());
                    
                    double courseFee = columns.length > 5 && !columns[5].trim().isEmpty() ? Double.parseDouble(columns[5].trim()) : getCourseFeeForTrade(detail.getTrade());
                    double amountPaid = columns.length > 6 && !columns[6].trim().isEmpty() ? Double.parseDouble(columns[6].trim()) : 0.0;
                    
                    detail.setCourseFee(courseFee);
                    detail.setAmountPaid(amountPaid);
                    detail.setOutstandingBalance(courseFee - amountPaid);
                    detail.setPaymentStatus(amountPaid >= courseFee ? "COMPLETED" : "PENDING");
                    
                    if (columns.length > 7 && !columns[7].trim().isEmpty()) detail.setPaymentMethod(columns[7].trim());
                    else detail.setPaymentMethod("Cash");
                    
                    if (columns.length > 8 && !columns[8].trim().isEmpty()) detail.setTransactionId(columns[8].trim());
                    
                    LocalDateTime appliedDate = LocalDateTime.now();
                    if (columns.length > 9 && !columns[9].trim().isEmpty()) {
                        LocalDate d = parseDate(columns[9].trim());
                        if (d != null) appliedDate = d.atStartOfDay();
                    }
                    detail.setAppliedDate(appliedDate);
                    detail.setPaymentDate(appliedDate.toLocalDate());
                    
                    detail.setStatus("APPROVED"); // Auto approve bulk uploads usually
                    detail.setAdminRemarks("Bulk Uploaded");
                    
                    toSave.add(detail);
                    successCount++;
                } catch (Exception e) {
                    errorCount++;
                }
            }
            
            admissionDetailRepository.saveAll(toSave);
            return ResponseEntity.ok(Map.of("message", "Bulk upload completed. Success: " + successCount + ", Errors: " + errorCount));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to process CSV file: " + e.getMessage()));
        }
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

class AdmissionFormDto {
    private String trade;
    private String fullName;
    private String fatherName;
    private String motherName;
    private String aadharNo;
    private String samagraId;
    private String dob;
    private String category;
    private String gender;
    private String religion;
    private String bloodGroup;
    private Double annualIncome;
    private String isPH;

    private String address;
    private String post;
    private String tehsil;
    private String distt;
    private String state;
    private String pin;
    private String mobile;
    private String parentMobile;
    private String whatsapp;
    private String email;

    private String tenthBoard;
    private String tenthSchool;
    private String tenthRollNo;
    private String tenthYear;
    private Integer tenthTotalMarks;
    private Integer tenthMarksObt;

    private String twelfthBoard;
    private String twelfthSchool;
    private String twelfthRollNo;
    private String twelfthYear;
    private Integer twelfthTotalMarks;
    private Integer twelfthMarksObt;

    // Files
    private MultipartFile photo;
    private MultipartFile signature;
    private MultipartFile tenthDocument;
    private MultipartFile twelfthDocument;
    private MultipartFile aadharDocument;
    private MultipartFile samagraDocument;
    private MultipartFile casteDocument;
    private MultipartFile incomeDocument;
    private MultipartFile domicileDocument;
    private MultipartFile paymentReceipt;

    private String paymentMethod;
    private String transactionId;
    private Double amountPaid;
    private String paymentDate;


    public AdmissionFormDto() {}

    // Getters and Setters
    public String getTrade() { return trade; }
    public void setTrade(String trade) { this.trade = trade; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getMotherName() { return motherName; }
    public void setMotherName(String motherName) { this.motherName = motherName; }

    public String getAadharNo() { return aadharNo; }
    public void setAadharNo(String aadharNo) { this.aadharNo = aadharNo; }

    public String getSamagraId() { return samagraId; }
    public void setSamagraId(String samagraId) { this.samagraId = samagraId; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getReligion() { return religion; }
    public void setReligion(String religion) { this.religion = religion; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public Double getAnnualIncome() { return annualIncome; }
    public void setAnnualIncome(Double annualIncome) { this.annualIncome = annualIncome; }

    public String getIsPH() { return isPH; }
    public void setIsPH(String isPH) { this.isPH = isPH; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPost() { return post; }
    public void setPost(String post) { this.post = post; }

    public String getTehsil() { return tehsil; }
    public void setTehsil(String tehsil) { this.tehsil = tehsil; }

    public String getDistt() { return distt; }
    public void setDistt(String distt) { this.distt = distt; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getParentMobile() { return parentMobile; }
    public void setParentMobile(String parentMobile) { this.parentMobile = parentMobile; }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTenthBoard() { return tenthBoard; }
    public void setTenthBoard(String tenthBoard) { this.tenthBoard = tenthBoard; }

    public String getTenthSchool() { return tenthSchool; }
    public void setTenthSchool(String tenthSchool) { this.tenthSchool = tenthSchool; }

    public String getTenthRollNo() { return tenthRollNo; }
    public void setTenthRollNo(String tenthRollNo) { this.tenthRollNo = tenthRollNo; }

    public String getTenthYear() { return tenthYear; }
    public void setTenthYear(String tenthYear) { this.tenthYear = tenthYear; }

    public Integer getTenthTotalMarks() { return tenthTotalMarks; }
    public void setTenthTotalMarks(Integer tenthTotalMarks) { this.tenthTotalMarks = tenthTotalMarks; }

    public Integer getTenthMarksObt() { return tenthMarksObt; }
    public void setTenthMarksObt(Integer tenthMarksObt) { this.tenthMarksObt = tenthMarksObt; }

    public String getTwelfthBoard() { return twelfthBoard; }
    public void setTwelfthBoard(String twelfthBoard) { this.twelfthBoard = twelfthBoard; }

    public String getTwelfthSchool() { return twelfthSchool; }
    public void setTwelfthSchool(String twelfthSchool) { this.twelfthSchool = twelfthSchool; }

    public String getTwelfthRollNo() { return twelfthRollNo; }
    public void setTwelfthRollNo(String twelfthRollNo) { this.twelfthRollNo = twelfthRollNo; }

    public String getTwelfthYear() { return twelfthYear; }
    public void setTwelfthYear(String twelfthYear) { this.twelfthYear = twelfthYear; }

    public Integer getTwelfthTotalMarks() { return twelfthTotalMarks; }
    public void setTwelfthTotalMarks(Integer twelfthTotalMarks) { this.twelfthTotalMarks = twelfthTotalMarks; }

    public Integer getTwelfthMarksObt() { return twelfthMarksObt; }
    public void setTwelfthMarksObt(Integer twelfthMarksObt) { this.twelfthMarksObt = twelfthMarksObt; }

    public MultipartFile getPhoto() { return photo; }
    public void setPhoto(MultipartFile photo) { this.photo = photo; }

    public MultipartFile getSignature() { return signature; }
    public void setSignature(MultipartFile signature) { this.signature = signature; }

    public MultipartFile getTenthDocument() { return tenthDocument; }
    public void setTenthDocument(MultipartFile tenthDocument) { this.tenthDocument = tenthDocument; }

    public MultipartFile getTwelfthDocument() { return twelfthDocument; }
    public void setTwelfthDocument(MultipartFile twelfthDocument) { this.twelfthDocument = twelfthDocument; }

    public MultipartFile getAadharDocument() { return aadharDocument; }
    public void setAadharDocument(MultipartFile aadharDocument) { this.aadharDocument = aadharDocument; }

    public MultipartFile getSamagraDocument() { return samagraDocument; }
    public void setSamagraDocument(MultipartFile samagraDocument) { this.samagraDocument = samagraDocument; }

    public MultipartFile getCasteDocument() { return casteDocument; }
    public void setCasteDocument(MultipartFile casteDocument) { this.casteDocument = casteDocument; }

    public MultipartFile getIncomeDocument() { return incomeDocument; }
    public void setIncomeDocument(MultipartFile incomeDocument) { this.incomeDocument = incomeDocument; }

    public MultipartFile getDomicileDocument() { return domicileDocument; }
    public void setDomicileDocument(MultipartFile domicileDocument) { this.domicileDocument = domicileDocument; }

    public MultipartFile getPaymentReceipt() { return paymentReceipt; }
    public void setPaymentReceipt(MultipartFile paymentReceipt) { this.paymentReceipt = paymentReceipt; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public Double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Double amountPaid) { this.amountPaid = amountPaid; }

    public String getPaymentDate() { return paymentDate; }
    public void setPaymentDate(String paymentDate) { this.paymentDate = paymentDate; }

    private Double courseFee;
    public Double getCourseFee() { return courseFee; }
    public void setCourseFee(Double courseFee) { this.courseFee = courseFee; }
}
