package com.sunshine.iti.controller;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class ProspectusController {

    @GetMapping("/prospectus")
    public ResponseEntity<byte[]> generateProspectus() {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4);
            document.setMargins(40, 40, 40, 40);
            PdfWriter.getInstance(document, baos);
            document.open();

            // ── Fonts ──────────────────────────────────────────────────────────
            Font titleFont     = new Font(Font.HELVETICA, 22, Font.BOLD, new java.awt.Color(37, 99, 235));
            Font subTitleFont  = new Font(Font.HELVETICA, 13, Font.BOLD);
            Font sectionFont   = new Font(Font.HELVETICA, 12, Font.BOLD, java.awt.Color.WHITE);
            Font labelFont     = new Font(Font.HELVETICA, 10, Font.BOLD);
            Font bodyFont      = new Font(Font.HELVETICA, 10, Font.NORMAL);
            Font smallFont     = new Font(Font.HELVETICA,  8, Font.ITALIC);
            Font tableHdrFont  = new Font(Font.HELVETICA,  9, Font.BOLD, java.awt.Color.WHITE);
            Font tableDataFont = new Font(Font.HELVETICA,  9, Font.NORMAL);

            // ── Header ─────────────────────────────────────────────────────────
            Paragraph title = new Paragraph("SUNSHINE PVT. ITI COLLEGE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph addr = new Paragraph("SEONI, MADHYA PRADESH – 480661\nAffiliation: DGT-12/1/18-TC  |  MIS Code: PU23001071\nPhone: +91-7000-XXXXXX  |  Email: info@sunshineiti.ac.in", bodyFont);
            addr.setAlignment(Element.ALIGN_CENTER);
            addr.setSpacingBefore(4f);
            document.add(addr);

            document.add(new Paragraph(" "));
            document.add(new Chunk(new LineSeparator()));
            document.add(new Paragraph(" "));

            Paragraph heading = new Paragraph("COLLEGE PROSPECTUS  –  Academic Session 2025-26", subTitleFont);
            heading.setAlignment(Element.ALIGN_CENTER);
            document.add(heading);

            document.add(new Paragraph("\n"));

            // ── About the College ──────────────────────────────────────────────
            addSectionHeader(document, "About the College", sectionFont);
            document.add(new Paragraph(
                "Sunshine Pvt. ITI College, Seoni (M.P.) is a NCVT & SCVT affiliated Industrial " +
                "Training Institute established with a vision to provide quality vocational training " +
                "to the youth. The college is equipped with modern laboratories, fully qualified " +
                "instructors, and a strong industry-placement network. We offer trades approved by " +
                "the Directorate General of Training (DGT), Ministry of Skill Development & " +
                "Entrepreneurship, Govt. of India.", bodyFont));
            document.add(new Paragraph("\n"));

            // ── Why Choose Us? ─────────────────────────────────────────────────
            addSectionHeader(document, "Why Choose Sunshine ITI?", sectionFont);
            String[] highlights = {
                "✔  NCVT / SCVT Affiliated – Nationally Recognised Certificates",
                "✔  Experienced & Certified Teaching Staff",
                "✔  Modern Computer Labs, Electrical Workshop & Health Labs",
                "✔  100% Practical-Oriented Training Curriculum",
                "✔  Campus Placement Assistance & Industry Tie-ups",
                "✔  Scholarships Available for SC / ST / OBC Students",
                "✔  Online Admission Portal & Digital Student Dashboard",
                "✔  Hostel & Transport Facilities (on request)"
            };
            for (String h : highlights) {
                document.add(new Paragraph(h, bodyFont));
            }
            document.add(new Paragraph("\n"));

            // ── Courses / Fee Table ────────────────────────────────────────────
            addSectionHeader(document, "Courses Offered & Fee Structure", sectionFont);
            document.add(new Paragraph(" "));

            PdfPTable courseTable = new PdfPTable(5);
            courseTable.setWidthPercentage(100);
            courseTable.setWidths(new float[]{0.5f, 2.8f, 1.3f, 1.2f, 1.2f});

            // Table Header
            for (String th : new String[]{"#", "Course Name", "Duration", "Eligibility", "Annual Fee"}) {
                PdfPCell hCell = new PdfPCell(new Paragraph(th, tableHdrFont));
                hCell.setBackgroundColor(new java.awt.Color(37, 99, 235));
                hCell.setPadding(6f);
                hCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                courseTable.addCell(hCell);
            }

            // Rows
            Object[][] courses = {
                {"1", "DCA – Diploma in Computer Application",              "1 Year",             "10th / 12th Pass",          "Rs. 11,000"},
                {"2", "PGDCA – Post Graduate Diploma in Computer Appln.",   "1 Year",             "Graduation (Any Stream)",    "Rs. 12,000"},
                {"3", "Electrician (NCVT)",                                 "2 Years (4 Sem.)",   "10th Pass (Sci & Maths)",   "Rs. 40,000"},
                {"4", "Health Sanitary Inspector (NCVT)",                   "1 Year (2 Sem.)",    "12th Pass (Bio)",           "Rs. 28,000"},
            };

            boolean alt = false;
            for (Object[] row : courses) {
                java.awt.Color bg = alt ? new java.awt.Color(240, 245, 255) : java.awt.Color.WHITE;
                for (Object cell : row) {
                    PdfPCell c = new PdfPCell(new Paragraph(cell.toString(), tableDataFont));
                    c.setBackgroundColor(bg);
                    c.setPadding(5f);
                    courseTable.addCell(c);
                }
                alt = !alt;
            }

            document.add(courseTable);
            document.add(new Paragraph("* Fees include tuition, practical, and examination charges. Hostel & transport charges are additional.", smallFont));
            document.add(new Paragraph("\n"));

            // ── Syllabus Highlights ────────────────────────────────────────────
            addSectionHeader(document, "Course Syllabus Highlights", sectionFont);
            document.add(new Paragraph(" "));

            String[][] syllabusData = {
                {"DCA", "Computer Fundamentals, MS Office, Internet & Email, Hindi/English Typing, Tally, Hardware & Networking, DTP, C Language, DBMS, Project Work"},
                {"PGDCA", "Advanced IT, C/C++, Data Structures, SQL/Oracle, Web Dev (HTML/CSS/JS), Java OOP, Software Engineering, Python, Cloud Computing, Major Project"},
                {"Electrician", "Electrical Fundamentals & Safety, AC/DC Theory, Domestic & Industrial Wiring, Transformers, Motors & Generators, PLC Basics, Power Distribution, Workshop Practice"},
                {"HSI", "Public Health & Hygiene, Anatomy, Microbiology, Environmental Sanitation, Water Purification, Food Safety (FSSAI), Epidemiology, First Aid, Field Training"}
            };

            PdfPTable syllTable = new PdfPTable(2);
            syllTable.setWidthPercentage(100);
            syllTable.setWidths(new float[]{1f, 3.5f});

            for (String[] row : syllabusData) {
                PdfPCell lCell = new PdfPCell(new Paragraph(row[0], labelFont));
                lCell.setBackgroundColor(new java.awt.Color(239, 246, 255));
                lCell.setPadding(6f);
                syllTable.addCell(lCell);
                PdfPCell rCell = new PdfPCell(new Paragraph(row[1], tableDataFont));
                rCell.setPadding(6f);
                syllTable.addCell(rCell);
            }
            document.add(syllTable);
            document.add(new Paragraph("\n"));

            // ── Admission Process ──────────────────────────────────────────────
            addSectionHeader(document, "Admission Process", sectionFont);
            String[] steps = {
                "1.  Visit our website: www.sunshineiti.ac.in and fill the Online Admission Form.",
                "2.  Upload required documents: Photo, Signature, Aadhar Card, 10th/12th Marksheet.",
                "3.  Pay the Registration/Initial Fee via UPI / Net Banking / Cash at counter.",
                "4.  Receive Admission Confirmation via Email / Student Dashboard.",
                "5.  Collect your college ID card on the first day of class."
            };
            for (String s : steps) {
                document.add(new Paragraph(s, bodyFont));
            }
            document.add(new Paragraph("\n"));

            // ── Documents Required ─────────────────────────────────────────────
            addSectionHeader(document, "Documents Required", sectionFont);
            String[] docs = {
                "•  Aadhar Card (Student)", "•  10th Marksheet & Certificate",
                "•  12th Marksheet (if applicable)", "•  Caste Certificate (for SC/ST/OBC)",
                "•  Domicile Certificate (M.P.)", "•  Income Certificate (for scholarship)",
                "•  Samagra ID (M.P. Residents)", "•  Passport-size Photograph (recent)",
                "•  Parent/Guardian Mobile No."
            };
            PdfPTable docsTable = new PdfPTable(3);
            docsTable.setWidthPercentage(100);
            for (String d : docs) {
                PdfPCell dc = new PdfPCell(new Paragraph(d, bodyFont));
                dc.setBorder(Rectangle.NO_BORDER);
                dc.setPaddingBottom(4f);
                docsTable.addCell(dc);
            }
            document.add(docsTable);
            document.add(new Paragraph("\n"));

            // ── Contact & Footer ──────────────────────────────────────────────
            document.add(new Chunk(new LineSeparator()));
            document.add(new Paragraph(" "));
            Paragraph contact = new Paragraph(
                "SUNSHINE PVT. ITI COLLEGE,  SEONI,  MADHYA PRADESH – 480661\n" +
                "Phone: +91-7000-XXXXXX  |  Email: info@sunshineiti.ac.in\n" +
                "Website: www.sunshineiti.ac.in  |  Admission Helpline: Mon–Sat, 9 AM – 5 PM\n" +
                "Prospectus generated on: " + LocalDate.now(), smallFont);
            contact.setAlignment(Element.ALIGN_CENTER);
            document.add(contact);

            document.close();

            byte[] pdf = baos.toByteArray();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Sunshine_ITI_Prospectus_2025-26.pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private void addSectionHeader(Document doc, String title, Font font) throws DocumentException {
        PdfPTable t = new PdfPTable(1);
        t.setWidthPercentage(100);
        t.setSpacingBefore(6f);
        t.setSpacingAfter(6f);
        PdfPCell c = new PdfPCell(new Paragraph("  " + title, font));
        c.setBackgroundColor(new java.awt.Color(37, 99, 235));
        c.setPadding(7f);
        c.setBorder(Rectangle.NO_BORDER);
        t.addCell(c);
        doc.add(t);
    }
}
