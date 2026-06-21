package com.sunshine.iti.controller;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.sunshine.iti.model.AdmissionDetail;
import com.sunshine.iti.repository.AdmissionDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class CertificateController {

    @Autowired
    private AdmissionDetailRepository admissionDetailRepository;

    @GetMapping("/certificate/{studentId}")
    public ResponseEntity<byte[]> generateCertificate(@PathVariable Long studentId) {
        Optional<AdmissionDetail> studentOpt = admissionDetailRepository.findById(studentId);
        if (!studentOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        AdmissionDetail student = studentOpt.get();

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, baos);
            document.open();

            // Fonts
            Font titleFont = new Font(Font.HELVETICA, 28, Font.BOLD, java.awt.Color.BLUE);
            Font subtitleFont = new Font(Font.HELVETICA, 16, Font.BOLD);
            Font regularFont = new Font(Font.HELVETICA, 14, Font.NORMAL);
            Font boldFont = new Font(Font.HELVETICA, 16, Font.BOLD);
            Font signatureFont = new Font(Font.HELVETICA, 12, Font.ITALIC);

            // Border
            document.add(new Paragraph(" "));
            
            // Header
            Paragraph title = new Paragraph("SUNSHINE PVT. ITI COLLEGE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subTitle = new Paragraph("SEONI (M.P.)", subtitleFont);
            subTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subTitle);
            
            Paragraph affiliation = new Paragraph("Affiliation: DGT-12/1/18-TC | MIS Code: PU23001071", new Font(Font.HELVETICA, 10, Font.ITALIC));
            affiliation.setAlignment(Element.ALIGN_CENTER);
            document.add(affiliation);

            document.add(new Paragraph(" "));
            LineSeparator ls = new LineSeparator();
            document.add(new Chunk(ls));
            document.add(new Paragraph(" "));

            Paragraph certTitle = new Paragraph("CERTIFICATE OF COMPLETION", new Font(Font.HELVETICA, 22, Font.BOLD, java.awt.Color.RED));
            certTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(certTitle);

            document.add(new Paragraph("\n\n"));

            // Body text
            Paragraph body1 = new Paragraph("This is to certify that", regularFont);
            body1.setAlignment(Element.ALIGN_CENTER);
            document.add(body1);

            Paragraph studentName = new Paragraph(student.getFullName().toUpperCase(), new Font(Font.HELVETICA, 24, Font.BOLD));
            studentName.setAlignment(Element.ALIGN_CENTER);
            document.add(studentName);

            Paragraph body2 = new Paragraph("Son/Daughter of " + student.getFatherName(), regularFont);
            body2.setAlignment(Element.ALIGN_CENTER);
            document.add(body2);

            document.add(new Paragraph("\n"));

            Paragraph body3 = new Paragraph("has successfully completed the prescribed course of training in the trade of", regularFont);
            body3.setAlignment(Element.ALIGN_CENTER);
            document.add(body3);

            Paragraph tradeName = new Paragraph(student.getTrade().toUpperCase(), new Font(Font.HELVETICA, 20, Font.BOLD, java.awt.Color.BLUE));
            tradeName.setAlignment(Element.ALIGN_CENTER);
            document.add(tradeName);

            document.add(new Paragraph("\n"));

            Paragraph body4 = new Paragraph("Application Number: ITI/2026/" + student.getId(), regularFont);
            body4.setAlignment(Element.ALIGN_CENTER);
            document.add(body4);

            document.add(new Paragraph("\n\n\n"));

            // Signatures
            PdfPTable sigTable = new PdfPTable(2);
            sigTable.setWidthPercentage(100);
            
            PdfPCell cell1 = new PdfPCell(new Paragraph("Date: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")), regularFont));
            cell1.setBorder(Rectangle.NO_BORDER);
            cell1.setHorizontalAlignment(Element.ALIGN_LEFT);
            sigTable.addCell(cell1);

            PdfPCell cell2 = new PdfPCell(new Paragraph("________________________\nPrincipal / Director", signatureFont));
            cell2.setBorder(Rectangle.NO_BORDER);
            cell2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            sigTable.addCell(cell2);

            document.add(sigTable);

            document.close();

            byte[] pdfBytes = baos.toByteArray();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Certificate_" + student.getId() + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
