package com.sunshine.iti.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "admission_details")
public class AdmissionDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trade;
    private String fullName;
    private String fatherName;
    private String motherName;
    private String aadharNo;
    private String samagraId;
    private LocalDate dob;
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

    // File binary storage (using MEDIUMBLOB in MySQL for files up to 16MB)
    @Lob
    @Column(columnDefinition="MEDIUMBLOB")
    @JsonIgnore
    private byte[] photoData;
    private String photoName;
    private String photoType;

    @Lob
    @Column(columnDefinition="MEDIUMBLOB")
    @JsonIgnore
    private byte[] signatureData;
    private String signatureName;
    private String signatureType;

    @Lob
    @Column(columnDefinition="MEDIUMBLOB")
    @JsonIgnore
    private byte[] tenthDocData;
    private String tenthDocName;
    private String tenthDocType;

    @Lob
    @Column(columnDefinition="MEDIUMBLOB")
    @JsonIgnore
    private byte[] twelfthDocData;
    private String twelfthDocName;
    private String twelfthDocType;

    @Lob
    @Column(columnDefinition="MEDIUMBLOB")
    @JsonIgnore
    private byte[] aadharDocData;
    private String aadharDocName;
    private String aadharDocType;

    @Lob
    @Column(columnDefinition="MEDIUMBLOB")
    @JsonIgnore
    private byte[] samagraDocData;
    private String samagraDocName;
    private String samagraDocType;

    @Lob
    @Column(columnDefinition="MEDIUMBLOB")
    @JsonIgnore
    private byte[] casteDocData;
    private String casteDocName;
    private String casteDocType;

    @Lob
    @Column(columnDefinition="MEDIUMBLOB")
    @JsonIgnore
    private byte[] incomeDocData;
    private String incomeDocName;
    private String incomeDocType;

    @Lob
    @Column(columnDefinition="MEDIUMBLOB")
    @JsonIgnore
    private byte[] domicileDocData;
    private String domicileDocName;
    private String domicileDocType;

    private String paymentMethod;
    private String transactionId;
    private Double amountPaid;
    private Double courseFee;
    private Double outstandingBalance;
    private String paymentStatus = "PENDING"; // PENDING, COMPLETED, FAILED
    private LocalDate paymentDate;

    @Lob
    @Column(columnDefinition="MEDIUMBLOB")
    @JsonIgnore
    private byte[] paymentReceiptData;
    private String paymentReceiptName;
    private String paymentReceiptType;

    private String status = "PENDING"; // PENDING, APPROVED, REJECTED
    private LocalDateTime appliedDate;
    
    @Column(columnDefinition="TEXT")
    private String adminRemarks;

    // Cloudinary URL fields
    private String photoUrl;
    private String signatureUrl;
    private String tenthDocUrl;
    private String twelfthDocUrl;
    private String aadharDocUrl;
    private String samagraDocUrl;
    private String casteDocUrl;
    private String incomeDocUrl;
    private String domicileDocUrl;
    private String paymentReceiptUrl;

    public AdmissionDetail() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTrade() {
        return trade;
    }

    public void setTrade(String trade) {
        this.trade = trade;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getFatherName() {
        return fatherName;
    }

    public void setFatherName(String fatherName) {
        this.fatherName = fatherName;
    }

    public String getMotherName() {
        return motherName;
    }

    public void setMotherName(String motherName) {
        this.motherName = motherName;
    }

    public String getAadharNo() {
        return aadharNo;
    }

    public void setAadharNo(String aadharNo) {
        this.aadharNo = aadharNo;
    }

    public String getSamagraId() {
        return samagraId;
    }

    public void setSamagraId(String samagraId) {
        this.samagraId = samagraId;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getReligion() {
        return religion;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Double getAnnualIncome() {
        return annualIncome;
    }

    public void setAnnualIncome(Double annualIncome) {
        this.annualIncome = annualIncome;
    }

    public String getIsPH() {
        return isPH;
    }

    public void setIsPH(String isPH) {
        this.isPH = isPH;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPost() {
        return post;
    }

    public void setPost(String post) {
        this.post = post;
    }

    public String getTehsil() {
        return tehsil;
    }

    public void setTehsil(String tehsil) {
        this.tehsil = tehsil;
    }

    public String getDistt() {
        return distt;
    }

    public void setDistt(String distt) {
        this.distt = distt;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getParentMobile() {
        return parentMobile;
    }

    public void setParentMobile(String parentMobile) {
        this.parentMobile = parentMobile;
    }

    public String getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTenthBoard() {
        return tenthBoard;
    }

    public void setTenthBoard(String tenthBoard) {
        this.tenthBoard = tenthBoard;
    }

    public String getTenthSchool() {
        return tenthSchool;
    }

    public void setTenthSchool(String tenthSchool) {
        this.tenthSchool = tenthSchool;
    }

    public String getTenthRollNo() {
        return tenthRollNo;
    }

    public void setTenthRollNo(String tenthRollNo) {
        this.tenthRollNo = tenthRollNo;
    }

    public String getTenthYear() {
        return tenthYear;
    }

    public void setTenthYear(String tenthYear) {
        this.tenthYear = tenthYear;
    }

    public Integer getTenthTotalMarks() {
        return tenthTotalMarks;
    }

    public void setTenthTotalMarks(Integer tenthTotalMarks) {
        this.tenthTotalMarks = tenthTotalMarks;
    }

    public Integer getTenthMarksObt() {
        return tenthMarksObt;
    }

    public void setTenthMarksObt(Integer tenthMarksObt) {
        this.tenthMarksObt = tenthMarksObt;
    }

    public String getTwelfthBoard() {
        return twelfthBoard;
    }

    public void setTwelfthBoard(String twelfthBoard) {
        this.twelfthBoard = twelfthBoard;
    }

    public String getTwelfthSchool() {
        return twelfthSchool;
    }

    public void setTwelfthSchool(String twelfthSchool) {
        this.twelfthSchool = twelfthSchool;
    }

    public String getTwelfthRollNo() {
        return twelfthRollNo;
    }

    public void setTwelfthRollNo(String twelfthRollNo) {
        this.twelfthRollNo = twelfthRollNo;
    }

    public String getTwelfthYear() {
        return twelfthYear;
    }

    public void setTwelfthYear(String twelfthYear) {
        this.twelfthYear = twelfthYear;
    }

    public Integer getTwelfthTotalMarks() {
        return twelfthTotalMarks;
    }

    public void setTwelfthTotalMarks(Integer twelfthTotalMarks) {
        this.twelfthTotalMarks = twelfthTotalMarks;
    }

    public Integer getTwelfthMarksObt() {
        return twelfthMarksObt;
    }

    public void setTwelfthMarksObt(Integer twelfthMarksObt) {
        this.twelfthMarksObt = twelfthMarksObt;
    }

    // Binary data mappings
    public byte[] getPhotoData() { return photoData; }
    public void setPhotoData(byte[] photoData) { this.photoData = photoData; }

    public String getPhotoName() { return photoName; }
    public void setPhotoName(String photoName) { this.photoName = photoName; }

    public String getPhotoType() { return photoType; }
    public void setPhotoType(String photoType) { this.photoType = photoType; }

    public byte[] getSignatureData() { return signatureData; }
    public void setSignatureData(byte[] signatureData) { this.signatureData = signatureData; }

    public String getSignatureName() { return signatureName; }
    public void setSignatureName(String signatureName) { this.signatureName = signatureName; }

    public String getSignatureType() { return signatureType; }
    public void setSignatureType(String signatureType) { this.signatureType = signatureType; }

    public byte[] getTenthDocData() { return tenthDocData; }
    public void setTenthDocData(byte[] tenthDocData) { this.tenthDocData = tenthDocData; }

    public String getTenthDocName() { return tenthDocName; }
    public void setTenthDocName(String tenthDocName) { this.tenthDocName = tenthDocName; }

    public String getTenthDocType() { return tenthDocType; }
    public void setTenthDocType(String tenthDocType) { this.tenthDocType = tenthDocType; }

    public byte[] getTwelfthDocData() { return twelfthDocData; }
    public void setTwelfthDocData(byte[] twelfthDocData) { this.twelfthDocData = twelfthDocData; }

    public String getTwelfthDocName() { return twelfthDocName; }
    public void setTwelfthDocName(String twelfthDocName) { this.twelfthDocName = twelfthDocName; }

    public String getTwelfthDocType() { return twelfthDocType; }
    public void setTwelfthDocType(String twelfthDocType) { this.twelfthDocType = twelfthDocType; }

    public byte[] getAadharDocData() { return aadharDocData; }
    public void setAadharDocData(byte[] aadharDocData) { this.aadharDocData = aadharDocData; }

    public String getAadharDocName() { return aadharDocName; }
    public void setAadharDocName(String aadharDocName) { this.aadharDocName = aadharDocName; }

    public String getAadharDocType() { return aadharDocType; }
    public void setAadharDocType(String aadharDocType) { this.aadharDocType = aadharDocType; }

    public byte[] getSamagraDocData() { return samagraDocData; }
    public void setSamagraDocData(byte[] samagraDocData) { this.samagraDocData = samagraDocData; }

    public String getSamagraDocName() { return samagraDocName; }
    public void setSamagraDocName(String samagraDocName) { this.samagraDocName = samagraDocName; }

    public String getSamagraDocType() { return samagraDocType; }
    public void setSamagraDocType(String samagraDocType) { this.samagraDocType = samagraDocType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getAppliedDate() { return appliedDate; }
    public void setAppliedDate(LocalDateTime appliedDate) { this.appliedDate = appliedDate; }

    public String getAdminRemarks() { return adminRemarks; }
    public void setAdminRemarks(String adminRemarks) { this.adminRemarks = adminRemarks; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public Double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Double amountPaid) { this.amountPaid = amountPaid; }

    public Double getCourseFee() { return courseFee; }
    public void setCourseFee(Double courseFee) { this.courseFee = courseFee; }

    public Double getOutstandingBalance() { return outstandingBalance; }
    public void setOutstandingBalance(Double outstandingBalance) { this.outstandingBalance = outstandingBalance; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public byte[] getPaymentReceiptData() { return paymentReceiptData; }
    public void setPaymentReceiptData(byte[] paymentReceiptData) { this.paymentReceiptData = paymentReceiptData; }

    public String getPaymentReceiptName() { return paymentReceiptName; }
    public void setPaymentReceiptName(String paymentReceiptName) { this.paymentReceiptName = paymentReceiptName; }

    public String getPaymentReceiptType() { return paymentReceiptType; }
    public void setPaymentReceiptType(String paymentReceiptType) { this.paymentReceiptType = paymentReceiptType; }

    public byte[] getCasteDocData() { return casteDocData; }
    public void setCasteDocData(byte[] casteDocData) { this.casteDocData = casteDocData; }
    public String getCasteDocName() { return casteDocName; }
    public void setCasteDocName(String casteDocName) { this.casteDocName = casteDocName; }
    public String getCasteDocType() { return casteDocType; }
    public void setCasteDocType(String casteDocType) { this.casteDocType = casteDocType; }

    public byte[] getIncomeDocData() { return incomeDocData; }
    public void setIncomeDocData(byte[] incomeDocData) { this.incomeDocData = incomeDocData; }
    public String getIncomeDocName() { return incomeDocName; }
    public void setIncomeDocName(String incomeDocName) { this.incomeDocName = incomeDocName; }
    public String getIncomeDocType() { return incomeDocType; }
    public void setIncomeDocType(String incomeDocType) { this.incomeDocType = incomeDocType; }

    public byte[] getDomicileDocData() { return domicileDocData; }
    public void setDomicileDocData(byte[] domicileDocData) { this.domicileDocData = domicileDocData; }
    public String getDomicileDocName() { return domicileDocName; }
    public void setDomicileDocName(String domicileDocName) { this.domicileDocName = domicileDocName; }
    public String getDomicileDocType() { return domicileDocType; }
    public void setDomicileDocType(String domicileDocType) { this.domicileDocType = domicileDocType; }

    // Cloudinary URL getters and setters
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    
    public String getSignatureUrl() { return signatureUrl; }
    public void setSignatureUrl(String signatureUrl) { this.signatureUrl = signatureUrl; }
    
    public String getTenthDocUrl() { return tenthDocUrl; }
    public void setTenthDocUrl(String tenthDocUrl) { this.tenthDocUrl = tenthDocUrl; }
    
    public String getTwelfthDocUrl() { return twelfthDocUrl; }
    public void setTwelfthDocUrl(String twelfthDocUrl) { this.twelfthDocUrl = twelfthDocUrl; }
    
    public String getAadharDocUrl() { return aadharDocUrl; }
    public void setAadharDocUrl(String aadharDocUrl) { this.aadharDocUrl = aadharDocUrl; }
    
    public String getSamagraDocUrl() { return samagraDocUrl; }
    public void setSamagraDocUrl(String samagraDocUrl) { this.samagraDocUrl = samagraDocUrl; }
    
    public String getCasteDocUrl() { return casteDocUrl; }
    public void setCasteDocUrl(String casteDocUrl) { this.casteDocUrl = casteDocUrl; }
    
    public String getIncomeDocUrl() { return incomeDocUrl; }
    public void setIncomeDocUrl(String incomeDocUrl) { this.incomeDocUrl = incomeDocUrl; }
    
    public String getDomicileDocUrl() { return domicileDocUrl; }
    public void setDomicileDocUrl(String domicileDocUrl) { this.domicileDocUrl = domicileDocUrl; }
    
    public String getPaymentReceiptUrl() { return paymentReceiptUrl; }
    public void setPaymentReceiptUrl(String paymentReceiptUrl) { this.paymentReceiptUrl = paymentReceiptUrl; }
}
