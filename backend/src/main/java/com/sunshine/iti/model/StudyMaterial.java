package com.sunshine.iti.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_materials")
public class StudyMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String trade; // e.g. Electrician, DCA, All Trades

    @Column(nullable = false)
    private String type; // PREVIOUS_PAPER or SYLLABUS

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType;

    @Lob
    @Column(columnDefinition = "MEDIUMBLOB")
    private byte[] fileData;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String descriptionHn;

    @Column(name = "title_hn")
    private String titleHn;

    @Column(name = "trade_hn")
    private String tradeHn;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }

    public StudyMaterial() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTrade() { return trade; }
    public void setTrade(String trade) { this.trade = trade; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public byte[] getFileData() { return fileData; }
    public void setFileData(byte[] fileData) { this.fileData = fileData; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDescriptionHn() { return descriptionHn; }
    public void setDescriptionHn(String descriptionHn) { this.descriptionHn = descriptionHn; }

    public String getTitleHn() { return titleHn; }
    public void setTitleHn(String titleHn) { this.titleHn = titleHn; }

    public String getTradeHn() { return tradeHn; }
    public void setTradeHn(String tradeHn) { this.tradeHn = tradeHn; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
