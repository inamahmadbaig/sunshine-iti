package com.sunshine.iti.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fee_payments")
public class FeePayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private AdmissionDetail admissionDetail;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String paymentMethod; // Cash, UPI, Bank Transfer

    private String transactionId;

    @Column(nullable = false)
    private LocalDateTime paymentDate;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED

    @Lob
    @Column(columnDefinition="MEDIUMBLOB")
    private byte[] receiptData;
    private String receiptName;
    private String receiptType;

    @Column(columnDefinition="TEXT")
    private String remarks; // Admin notes if rejected or manually added

    @Column(nullable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();

    public FeePayment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AdmissionDetail getAdmissionDetail() { return admissionDetail; }
    public void setAdmissionDetail(AdmissionDetail admissionDetail) { this.admissionDetail = admissionDetail; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public byte[] getReceiptData() { return receiptData; }
    public void setReceiptData(byte[] receiptData) { this.receiptData = receiptData; }

    public String getReceiptName() { return receiptName; }
    public void setReceiptName(String receiptName) { this.receiptName = receiptName; }

    public String getReceiptType() { return receiptType; }
    public void setReceiptType(String receiptType) { this.receiptType = receiptType; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
