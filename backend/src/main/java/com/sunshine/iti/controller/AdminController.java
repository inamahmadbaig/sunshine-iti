package com.sunshine.iti.controller;

import com.sunshine.iti.model.AdminUser;
import com.sunshine.iti.model.OtpVerification;
import com.sunshine.iti.repository.AdminUserRepository;
import com.sunshine.iti.repository.OtpVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.sunshine.iti.security.JwtUtil;
import com.sunshine.iti.model.AdmissionDetail;
import com.sunshine.iti.repository.AdmissionDetailRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private AdmissionDetailRepository admissionDetailRepository;

    @Autowired
    private OtpVerificationRepository otpVerificationRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private com.sunshine.iti.util.EmailHelper emailHelper;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AdminUser user) {
        if (adminUserRepository.findFirstByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }
        if (adminUserRepository.findFirstByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        AdminUser saved = adminUserRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<AdminUser> userOpt = adminUserRepository.findFirstByUsername(username);
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            String token = jwtUtil.generateToken(username);
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("token", token);
            response.put("user", userOpt.get());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid username or password"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Optional<AdminUser> userOpt = adminUserRepository.findFirstByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Admin email not registered"));
        }

        // Generate 6 digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        // Save OTP Verification
        OtpVerification verification = new OtpVerification(email, otp, LocalDateTime.now().plusMinutes(5));
        otpVerificationRepository.save(verification);

        // Send Email
        try {
            emailHelper.sendOtpEmail(email, otp);
        } catch (Exception e) {
            System.err.println("Mail sending failed: " + e.getMessage());
            System.out.println("DEBUG OTP GENERATION ALERT: OTP is " + otp);
        }

        return ResponseEntity.ok(Map.of("message", "OTP sent successfully. Please check your email."));
    }

    @PostMapping("/forgot-username")
    public ResponseEntity<?> forgotUsername(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Optional<AdminUser> userOpt = adminUserRepository.findFirstByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Admin email not registered"));
        }

        AdminUser user = userOpt.get();
        String username = user.getUsername();

        // Send Email
        String htmlContent = "<p>Dear Admin,</p>" +
                "<p>You requested username recovery for the Sunshine ITI Administration Portal.</p>" +
                "<p>Your registered username is: <strong>" + username + "</strong></p>" +
                "<br><p>Regards,<br>Sunshine ITI College</p>";

        try {
            emailHelper.sendBrevoEmail(email, "Admin User", "Sunshine ITI Portal - Admin Username Recovery", htmlContent, null, null);
        } catch (Exception e) {
            System.err.println("Mail sending failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to send email. Please check server logs."));
        }

        return ResponseEntity.ok(Map.of("message", "Username has been sent to your email successfully."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        String newPassword = body.get("newPassword");

        Optional<OtpVerification> verificationOpt = otpVerificationRepository.findTopByEmailOrderByExpiryTimeDesc(email);
        if (!verificationOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No OTP requested for this email"));
        }

        OtpVerification verification = verificationOpt.get();
        if (verification.getExpiryTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("error", "OTP has expired. Please request a new one."));
        }

        if (!verification.getOtp().equals(otp)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP code"));
        }

        // Update Password
        Optional<AdminUser> userOpt = adminUserRepository.findFirstByEmail(email);
        if (userOpt.isPresent()) {
            AdminUser user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            adminUserRepository.save(user);
            
            // Delete OTP history
            otpVerificationRepository.delete(verification);

            // Send Email Notification
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom("sunshineiti8@gmail.com");
            msg.setTo(user.getEmail());
            msg.setSubject("Sunshine ITI Portal - Security Alert: Password Reset Successful");
            msg.setText("Dear " + user.getUsername() + ",\n\nYour admin password has been successfully reset.\n\nHere are your current login credentials:\nUsername: " + user.getUsername() + "\nPassword: " + newPassword + "\n\nIf you did not request this change, please contact the system administrator immediately.\n\nRegards,\nSunshine ITI College");
            try {
                mailSender.send(msg);
            } catch (Exception e) {
                System.err.println("Failed to send password reset confirmation email: " + e.getMessage());
            }

            return ResponseEntity.ok(Map.of("message", "Password reset successfully. You can now log in."));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "User search failed"));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> body) {
        String currentEmail = body.get("currentEmail");
        String newUsername = body.get("newUsername");
        String newEmail = body.get("newEmail");

        Optional<AdminUser> userOpt = adminUserRepository.findFirstByEmail(currentEmail);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Admin not found"));
        }

        AdminUser user = userOpt.get();
        if (newUsername != null && !newUsername.trim().isEmpty()) {
            user.setUsername(newUsername);
        }
        if (newEmail != null && !newEmail.trim().isEmpty()) {
            // Check if new email is already taken by someone else
            Optional<AdminUser> existing = adminUserRepository.findFirstByEmail(newEmail);
            if (existing.isPresent() && !existing.get().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already in use by another admin"));
            }
            user.setEmail(newEmail);
        }

        AdminUser saved = adminUserRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        Optional<AdminUser> userOpt = adminUserRepository.findFirstByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Admin not found"));
        }

        AdminUser user = userOpt.get();
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Incorrect current password"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        adminUserRepository.save(user);

        // Send Email Notification
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom("sunshineiti8@gmail.com");
        msg.setTo(user.getEmail());
        msg.setSubject("Sunshine ITI Portal - Security Alert: Password Changed");
        msg.setText("Dear " + user.getUsername() + ",\n\nYour admin password was just changed from the Profile dashboard.\n\nHere are your updated login credentials:\nUsername: " + user.getUsername() + "\nPassword: " + newPassword + "\n\nIf you did not make this change, please contact the system administrator immediately.\n\nRegards,\nSunshine ITI College");
        try {
            mailSender.send(msg);
        } catch (Exception e) {
            System.err.println("Failed to send password change confirmation email: " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @PostMapping(value = "/broadcast", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> broadcastNotification(
            @RequestParam("subject") String subject,
            @RequestParam("message") String message,
            @RequestParam("recipientType") String recipientType,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        
        try {
            List<AdmissionDetail> students = admissionDetailRepository.findAll();
            
            if ("Approved".equalsIgnoreCase(recipientType)) {
                students = students.stream()
                        .filter(s -> "APPROVED".equalsIgnoreCase(s.getStatus()))
                        .collect(Collectors.toList());
            }

            List<String> bccEmails = students.stream()
                    .map(AdmissionDetail::getEmail)
                    .filter(email -> email != null && !email.trim().isEmpty())
                    .distinct()
                    .collect(Collectors.toList());

            if (bccEmails.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No valid student emails found to broadcast to."));
            }

            String attName = null;
            byte[] attBytes = null;
            if (file != null && !file.isEmpty()) {
                attName = file.getOriginalFilename();
                attBytes = file.getBytes();
            }

            String htmlContent = "<html><body>" +
                    "<p>Dear Student,</p>" +
                    "<p>" + message.replace("\n", "<br>") + "</p>" +
                    "<br><p>Best Regards,</p>" +
                    "<p><strong>Sunshine Pvt. ITI</strong><br>Contact: +91-7415491034</p>" +
                    "</body></html>";

            emailHelper.sendBrevoBroadcast(bccEmails, subject, htmlContent, attName, attBytes);

            return ResponseEntity.ok(Map.of("message", "Notification with attachment successfully broadcasted to " + bccEmails.size() + " students!"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send broadcast: " + e.getMessage()));
        }
    }
}
