package com.sunshine.iti.util;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.PdfPCell;
import com.sunshine.iti.model.AdmissionDetail;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Component
public class EmailHelper {

    private final JavaMailSender mailSender;

    public EmailHelper(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPendingEmail(AdmissionDetail student) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("sunshineiti8@gmail.com");
            helper.setTo(student.getEmail());
            helper.setSubject("Admission Application Received - Pending Verification");
            
            String htmlContent = "<html><body>" +
                    "<h2>Dear " + student.getFullName() + ",</h2>" +
                    "<p>Thank you for submitting your admission form at <strong>Sunshine Pvt. ITI College, Seoni</strong>.</p>" +
                    "<p>Your application has been received and is currently <strong>PENDING VERIFICATION</strong> by the college administration.</p>" +
                    "<h3>Application & Payment Summary:</h3>" +
                    "<table border='1' cellpadding='8' style='border-collapse: collapse;'>" +
                    "<tr><td><strong>Application Number (ID):</strong></td><td style='font-size: 16px; color: #2563eb;'><strong>ITI/2026/" + student.getId() + "</strong></td></tr>" +
                    "<tr><td><strong>Trade Applied:</strong></td><td>" + student.getTrade() + "</td></tr>" +
                    "<tr><td><strong>Aadhar Number:</strong></td><td>" + student.getAadharNo() + "</td></tr>" +
                    "<tr><td><strong>Payment Method:</strong></td><td>" + student.getPaymentMethod() + "</td></tr>" +
                    "<tr><td><strong>Transaction ID / UTR:</strong></td><td>" + student.getTransactionId() + "</td></tr>" +
                    "<tr><td><strong>Amount Paid:</strong></td><td>₹ " + student.getAmountPaid() + "</td></tr>" +
                    "<tr><td><strong>Course Fee:</strong></td><td>₹ " + student.getCourseFee() + "</td></tr>" +
                    "<tr><td><strong>Remaining Pay:</strong></td><td>₹ " + student.getOutstandingBalance() + "</td></tr>" +
                    "<tr><td><strong>Application Status:</strong></td><td>PENDING</td></tr>" +
                    "</table>" +
                    "<p>Once the admin verifies your details, documents, and payment, you will receive a confirmation email along with your fee receipt.</p>" +
                    "<br><p>Best Regards,</p>" +
                    "<p><strong>Sunshine Pvt. ITI</strong><br>Seoni, Madhya Pradesh<br>Contact: +91-7415491034</p>" +
                    "</body></html>";
                    
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send pending email: " + e.getMessage());
        }
    }

    public void sendApprovalEmail(AdmissionDetail student) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("sunshineiti8@gmail.com");
            helper.setTo(student.getEmail());
            helper.setSubject("Sunshine ITI - Admission Confirmed & Fee Receipt");
            
            String htmlContent = "<html><body>" +
                    "<h2>Dear " + student.getFullName() + ",</h2>" +
                    "<p>Congratulations! Your admission to the <strong>" + student.getTrade() + "</strong> trade at <strong>Sunshine Pvt. ITI College, Seoni</strong> has been verified and <strong>APPROVED</strong>.</p>" +
                    "<p>We have received your payment, and your admission is now finalized. Please find your official Fee Receipt attached as a PDF to this email.</p>" +
                    "<h3>Admission & Receipt Details:</h3>" +
                    "<table border='1' cellpadding='8' style='border-collapse: collapse;'>" +
                    "<tr><td><strong>Application Number (ID):</strong></td><td style='font-size: 16px; color: #2563eb;'><strong>ITI/2026/" + student.getId() + "</strong></td></tr>" +
                    "<tr><td><strong>Receipt Number:</strong></td><td>SUNSHINE/2026/" + student.getId() + "</td></tr>" +
                    "<tr><td><strong>Trade:</strong></td><td>" + student.getTrade() + "</td></tr>" +
                    "<tr><td><strong>Total Course Fee:</strong></td><td>₹ " + student.getCourseFee() + "</td></tr>" +
                    "<tr><td><strong>Amount Paid:</strong></td><td>₹ " + student.getAmountPaid() + "</td></tr>" +
                    "<tr><td><strong>Remaining Pay:</strong></td><td>₹ " + student.getOutstandingBalance() + "</td></tr>" +
                    "<tr><td><strong>Payment Status:</strong></td><td>COMPLETED</td></tr>" +
                    "</table>" +
                    "<h3>Access Your Student Portal:</h3>" +
                    "<p>You can now log in to the Student Portal to check your fees, attendance, and exam results.</p>" +
                    "<ul>" +
                    "<li><strong>Portal Link:</strong> <a href='http://localhost:5174/student-login'>Click here to Login</a></li>" +
                    "<li><strong>Application Number:</strong> ITI/2026/" + student.getId() + " <em>(or just " + student.getId() + ")</em></li>" +
                    "<li><strong>Password:</strong> " + student.getDob() + " <em>(Your Date of Birth)</em></li>" +
                    "</ul>" +
                    "<p>We look forward to welcoming you to our campus. Please keep the attached receipt for future reference.</p>" +
                    "<br><p>Best Regards,</p>" +
                    "<p><strong>Sunshine Pvt. ITI</strong><br>Seoni, Madhya Pradesh<br>Contact: +91-7415491034</p>" +
                    "</body></html>";
                    
            helper.setText(htmlContent, true);
            
            // Generate PDF Receipt
            byte[] pdfBytes = generateReceiptPdf(student);
            helper.addAttachment("Fee_Receipt_" + student.getId() + ".pdf", new ByteArrayResource(pdfBytes));
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send approval email: " + e.getMessage());
        }
    }

    public byte[] generateReceiptPdf(AdmissionDetail student) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();
        try {
            PdfWriter.getInstance(document, baos);
            document.open();
            
            // Header fonts
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font subtitleFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 10, Font.NORMAL);
            Font boldFont = new Font(Font.HELVETICA, 10, Font.BOLD);
            
            Paragraph title = new Paragraph("SUNSHINE PVT. ITI COLLEGE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            
            Paragraph subtitle = new Paragraph("SEONI (M.P.)\nAffiliation: DGT-12/1/18-TC | MIS Code: PU23001071", subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subtitle);
            
            Paragraph divider = new Paragraph("----------------------------------------------------------------------------------------------------------------------------------", normalFont);
            divider.setAlignment(Element.ALIGN_CENTER);
            document.add(divider);
            
            Paragraph docTitle = new Paragraph("ADMISSION FEE RECEIPT", subtitleFont);
            docTitle.setAlignment(Element.ALIGN_CENTER);
            docTitle.setSpacingAfter(15);
            document.add(docTitle);
            
            // Create table
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);
            table.setSpacingAfter(10);
            
            addTableCell(table, "Application Number (ID):", boldFont);
            addTableCell(table, "ITI/2026/" + student.getId(), normalFont);
            
            addTableCell(table, "Receipt No:", boldFont);
            addTableCell(table, "SUNSHINE/2026/" + student.getId(), normalFont);
            
            addTableCell(table, "Date of Issue:", boldFont);
            addTableCell(table, java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")), normalFont);
            
            addTableCell(table, "Student Full Name:", boldFont);
            addTableCell(table, student.getFullName(), normalFont);
            
            addTableCell(table, "Father's Name:", boldFont);
            addTableCell(table, student.getFatherName(), normalFont);
            
            addTableCell(table, "Aadhar Number:", boldFont);
            addTableCell(table, student.getAadharNo(), normalFont);
            
            addTableCell(table, "Trade enrolled:", boldFont);
            addTableCell(table, student.getTrade(), normalFont);
            
            addTableCell(table, "Total Course Fee (Annual):", boldFont);
            addTableCell(table, "Rs. " + String.format("%.2f", student.getCourseFee() != null ? student.getCourseFee() : 0.0), normalFont);
            
            addTableCell(table, "Amount Paid:", boldFont);
            addTableCell(table, "Rs. " + String.format("%.2f", student.getAmountPaid() != null ? student.getAmountPaid() : 0.0), normalFont);
            
            addTableCell(table, "Remaining Pay:", boldFont);
            addTableCell(table, "Rs. " + String.format("%.2f", student.getOutstandingBalance() != null ? student.getOutstandingBalance() : 0.0), normalFont);
            
            addTableCell(table, "Payment Method:", boldFont);
            addTableCell(table, student.getPaymentMethod() != null ? student.getPaymentMethod() : "N/A", normalFont);
            
            addTableCell(table, "Transaction ID / UTR:", boldFont);
            addTableCell(table, student.getTransactionId() != null ? student.getTransactionId() : "N/A", normalFont);
            
            addTableCell(table, "Status:", boldFont);
            addTableCell(table, "APPROVED & COMPLETED", normalFont);
            
            document.add(table);
            
            Paragraph thankYou = new Paragraph("\n\nThank you for choosing Sunshine Pvt. ITI College.", normalFont);
            thankYou.setAlignment(Element.ALIGN_CENTER);
            document.add(thankYou);
            
            Paragraph disclaimer = new Paragraph("This is an electronically generated receipt and does not require a physical signature.", normalFont);
            disclaimer.setAlignment(Element.ALIGN_CENTER);
            disclaimer.setSpacingBefore(30);
            document.add(disclaimer);
            
        } catch (Exception e) {
            System.err.println("PDF Receipt generation failed: " + e.getMessage());
        } finally {
            document.close();
        }
        return baos.toByteArray();
    }
    
    private void addTableCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setPadding(8);
        table.addCell(cell);
    }
}
