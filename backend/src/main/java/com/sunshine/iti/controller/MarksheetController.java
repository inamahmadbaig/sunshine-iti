package com.sunshine.iti.controller;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.sunshine.iti.model.AdmissionDetail;
import com.sunshine.iti.model.ExamResult;
import com.sunshine.iti.repository.AdmissionDetailRepository;
import com.sunshine.iti.repository.ExamResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class MarksheetController {

    @Autowired
    private AdmissionDetailRepository admissionDetailRepository;

    @Autowired
    private ExamResultRepository examResultRepository;

    @GetMapping("/student/{studentId}/marksheet")
    public ResponseEntity<byte[]> generateMarksheet(@PathVariable Long studentId) {
        Optional<AdmissionDetail> studentOpt = admissionDetailRepository.findById(studentId);
        if (!studentOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        AdmissionDetail student = studentOpt.get();
        List<ExamResult> results = examResultRepository.findByAdmissionDetailIdOrderBySemesterOrYearDesc(studentId);

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4);
            // Smaller margins for official look
            document.setMargins(30, 30, 30, 30);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Fonts
            Font headerSmall = new Font(Font.HELVETICA, 8, Font.NORMAL);
            Font titleFont = new Font(Font.HELVETICA, 11, Font.BOLD);
            Font subTitleFont = new Font(Font.HELVETICA, 9, Font.BOLD);
            Font labelFont = new Font(Font.HELVETICA, 9, Font.BOLD);
            Font valueFont = new Font(Font.HELVETICA, 9, Font.NORMAL);
            Font tableHeaderFont = new Font(Font.HELVETICA, 9, Font.BOLD);
            Font tableDataFont = new Font(Font.HELVETICA, 9, Font.NORMAL);

            // ==================== TOP HEADER ====================
            PdfPTable headerTable = new PdfPTable(3);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{1.5f, 4f, 1.5f});

            // Left Cell: Student Photo
            PdfPCell photoCell = new PdfPCell();
            photoCell.setBorder(Rectangle.NO_BORDER);
            if (student.getPhotoData() != null && student.getPhotoData().length > 0) {
                try {
                    Image photo = Image.getInstance(student.getPhotoData());
                    photo.scaleAbsolute(70f, 90f);
                    photoCell.addElement(photo);
                } catch (Exception e) {
                    photoCell.addElement(new Paragraph("[Photo Error]", headerSmall));
                }
            } else {
                PdfPTable dummyPhoto = new PdfPTable(1);
                PdfPCell dpCell = new PdfPCell(new Paragraph("\n\nPhoto\n\n\n", headerSmall));
                dpCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                dpCell.setFixedHeight(90f);
                dummyPhoto.addCell(dpCell);
                photoCell.addElement(dummyPhoto);
            }
            headerTable.addCell(photoCell);

            // Center Cell: Titles
            PdfPCell centerTitleCell = new PdfPCell();
            centerTitleCell.setBorder(Rectangle.NO_BORDER);
            centerTitleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            
            Paragraph p1 = new Paragraph("CONSOLIDATED STATEMENT OF MARKS\n(CRAFTSMEN TRAINING SCHEME)", titleFont);
            p1.setAlignment(Element.ALIGN_CENTER);
            centerTitleCell.addElement(p1);
            
            Paragraph p2 = new Paragraph("Academic Session: 2024 - 2026", subTitleFont); // Example static or dynamic
            p2.setAlignment(Element.ALIGN_CENTER);
            p2.setSpacingBefore(5f);
            centerTitleCell.addElement(p2);
            
            Paragraph p3 = new Paragraph("All India Trade Test (Annual System)\n", subTitleFont);
            p3.setAlignment(Element.ALIGN_CENTER);
            centerTitleCell.addElement(p3);
            
            headerTable.addCell(centerTitleCell);

            // Right Cell: Roll No & QR Placeholder
            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            
            Paragraph rollPara = new Paragraph("Roll No: APP-2026-" + student.getId(), subTitleFont);
            rollPara.setAlignment(Element.ALIGN_RIGHT);
            rightCell.addElement(rollPara);
            
            PdfPTable qrTable = new PdfPTable(1);
            qrTable.setWidthPercentage(60);
            qrTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            PdfPCell qrCell = new PdfPCell(new Paragraph("\n\nQR\nCODE\n\n\n", headerSmall));
            qrCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            qrCell.setFixedHeight(70f);
            qrTable.addCell(qrCell);
            
            rightCell.addElement(new Paragraph(" "));
            rightCell.addElement(qrTable);
            
            headerTable.addCell(rightCell);

            document.add(headerTable);
            document.add(new Paragraph("\n"));

            // ==================== STUDENT DETAILS ====================
            PdfPTable detailsTable = new PdfPTable(4);
            detailsTable.setWidthPercentage(100);
            detailsTable.setWidths(new float[]{1.2f, 2.5f, 1f, 1.5f});
            detailsTable.setSpacingAfter(15f);

            // Row 1: Name & DOB
            addDetailCell(detailsTable, "Name:", labelFont);
            addDetailCell(detailsTable, student.getFullName().toUpperCase(), valueFont);
            addDetailCell(detailsTable, "Date of Birth:", labelFont);
            addDetailCell(detailsTable, student.getDob() != null ? student.getDob().toString() : "-", valueFont);

            // Row 2: Father Name & Mother Name
            addDetailCell(detailsTable, "Father/Guardian Name:", labelFont);
            addDetailCell(detailsTable, student.getFatherName().toUpperCase(), valueFont);
            addDetailCell(detailsTable, "Mother Name:", labelFont);
            addDetailCell(detailsTable, student.getMotherName() != null ? student.getMotherName().toUpperCase() : "-", valueFont);

            // Row 3: Trade & Duration
            addDetailCell(detailsTable, "Trade Name:", labelFont);
            addDetailCell(detailsTable, student.getTrade().toUpperCase(), valueFont);
            addDetailCell(detailsTable, "Duration:", labelFont);
            addDetailCell(detailsTable, "2 Years", valueFont);

            // Row 4: ITI Name
            addDetailCell(detailsTable, "ITI Name & Address:", labelFont);
            PdfPCell itiCell = new PdfPCell(new Paragraph("SUNSHINE PVT. ITI COLLEGE, SEONI, MADHYA PRADESH", valueFont));
            itiCell.setColspan(3);
            itiCell.setBorder(Rectangle.NO_BORDER);
            itiCell.setPaddingBottom(5f);
            detailsTable.addCell(itiCell);

            document.add(detailsTable);

            // ==================== MARKS TABLE ====================
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{0.8f, 3f, 2f, 1.5f, 1.5f, 1.5f});

            // Table Headers
            String[] headersArr = {"S.No.", "Subject Name", "Semester / Year", "Max Marks", "Marks Secured", "Result"};
            for (String h : headersArr) {
                PdfPCell cell = new PdfPCell(new Paragraph(h, tableHeaderFont));
                cell.setPadding(6f);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cell.setBackgroundColor(new java.awt.Color(240, 240, 240));
                table.addCell(cell);
            }

            int totalMax = 0;
            int totalObt = 0;
            int count = 1;
            boolean overallPass = true;

            if (results.isEmpty()) {
                PdfPCell emptyCell = new PdfPCell(new Paragraph("No exam results uploaded for this student.", valueFont));
                emptyCell.setColspan(6);
                emptyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                emptyCell.setPadding(10f);
                table.addCell(emptyCell);
            } else {
                for (ExamResult res : results) {
                    table.addCell(new PdfPCell(new Paragraph(String.valueOf(count++), tableDataFont))).setHorizontalAlignment(Element.ALIGN_CENTER);
                    table.addCell(new PdfPCell(new Paragraph(res.getSubject(), tableDataFont))).setPadding(4f);
                    table.addCell(new PdfPCell(new Paragraph(res.getSemesterOrYear(), tableDataFont))).setHorizontalAlignment(Element.ALIGN_CENTER);
                    
                    PdfPCell mmCell = new PdfPCell(new Paragraph(String.valueOf(res.getMaxMarks()), tableDataFont));
                    mmCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    table.addCell(mmCell);
                    
                    PdfPCell moCell = new PdfPCell(new Paragraph(String.valueOf(res.getMarksObtained()), tableDataFont));
                    moCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    table.addCell(moCell);
                    
                    PdfPCell sCell = new PdfPCell(new Paragraph(res.getStatus(), tableDataFont));
                    sCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    table.addCell(sCell);

                    totalMax += res.getMaxMarks();
                    totalObt += res.getMarksObtained();
                    if (!"PASS".equalsIgnoreCase(res.getStatus())) {
                        overallPass = false;
                    }
                }

                // Total Row
                PdfPCell totalLabelCell = new PdfPCell(new Paragraph("TOTAL", tableHeaderFont));
                totalLabelCell.setColspan(3);
                totalLabelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                totalLabelCell.setPadding(5f);
                table.addCell(totalLabelCell);

                PdfPCell tMaxCell = new PdfPCell(new Paragraph(String.valueOf(totalMax), tableHeaderFont));
                tMaxCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                tMaxCell.setPadding(5f);
                table.addCell(tMaxCell);

                PdfPCell tObtCell = new PdfPCell(new Paragraph(String.valueOf(totalObt), tableHeaderFont));
                tObtCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                tObtCell.setPadding(5f);
                table.addCell(tObtCell);

                PdfPCell finalResCell = new PdfPCell(new Paragraph(overallPass ? "PASS" : "FAIL", tableHeaderFont));
                finalResCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                finalResCell.setPadding(5f);
                table.addCell(finalResCell);
            }

            document.add(table);

            // ==================== DISCLAIMER & SIGNATURES ====================
            document.add(new Paragraph("\n"));
            Paragraph disclaimer = new Paragraph("* This is a computer generated mark sheet. Any discrepancy should be reported to the ITI administration immediately.", headerSmall);
            document.add(disclaimer);

            document.add(new Paragraph("\n\n\n\n"));

            PdfPTable sigTable = new PdfPTable(2);
            sigTable.setWidthPercentage(100);
            
            PdfPCell sig1 = new PdfPCell(new Paragraph("Date: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy")) + "\nPlace: SEONI", valueFont));
            sig1.setBorder(Rectangle.NO_BORDER);
            sig1.setHorizontalAlignment(Element.ALIGN_LEFT);
            sigTable.addCell(sig1);

            PdfPCell sig2 = new PdfPCell(new Paragraph("________________________\nPrincipal / Director", labelFont));
            sig2.setBorder(Rectangle.NO_BORDER);
            sig2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            sigTable.addCell(sig2);

            document.add(sigTable);

            document.close();

            byte[] pdfBytes = baos.toByteArray();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "NCVT_Marksheet_" + student.getId() + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private void addDetailCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPaddingBottom(5f);
        table.addCell(cell);
    }
}
