package com.sunshine.iti.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exam_results")
public class ExamResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private AdmissionDetail admissionDetail;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String semesterOrYear; // e.g., "Semester 1", "Year 1"

    @Column(nullable = false)
    private Integer maxMarks;

    @Column(nullable = false)
    private Integer marksObtained;

    @Column(nullable = false)
    private String grade;

    @Column(nullable = false)
    private String status; // "PASS", "FAIL"

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }

    public ExamResult() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AdmissionDetail getAdmissionDetail() {
        return admissionDetail;
    }

    public void setAdmissionDetail(AdmissionDetail admissionDetail) {
        this.admissionDetail = admissionDetail;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getSemesterOrYear() {
        return semesterOrYear;
    }

    public void setSemesterOrYear(String semesterOrYear) {
        this.semesterOrYear = semesterOrYear;
    }

    public Integer getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(Integer maxMarks) {
        this.maxMarks = maxMarks;
    }

    public Integer getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(Integer marksObtained) {
        this.marksObtained = marksObtained;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
