package com.sunshine.iti.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class BackupController {

    @org.springframework.beans.factory.annotation.Value("${spring.datasource.url}")
    private String dbUrl;

    @org.springframework.beans.factory.annotation.Value("${spring.datasource.username}")
    private String dbUser;

    @org.springframework.beans.factory.annotation.Value("${spring.datasource.password}")
    private String dbPass;

    @GetMapping("/backup")
    public ResponseEntity<?> downloadBackup() {
        try {
            // Dynamically parse database name from the configuration URL
            String dbName = "iti2";
            if (dbUrl != null && dbUrl.contains("/")) {
                String afterHost = dbUrl.substring(dbUrl.lastIndexOf("/") + 1);
                if (afterHost.contains("?")) {
                    dbName = afterHost.substring(0, afterHost.indexOf("?"));
                } else {
                    dbName = afterHost;
                }
            }

            ProcessBuilder pb;
            if (dbPass == null || dbPass.isEmpty()) {
                pb = new ProcessBuilder("mysqldump", "-u", dbUser, dbName);
            } else {
                pb = new ProcessBuilder("mysqldump", "-u", dbUser, "-p" + dbPass, dbName);
            }

            Process process = pb.start();
            
            StringBuilder backupContent = new StringBuilder();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                backupContent.append(line).append("\n");
            }
            
            int exitCode = process.waitFor();
            
            if (exitCode != 0 || backupContent.length() == 0) {
                // If mysqldump fails (usually due to not being in PATH)
                StringBuilder errorContent = new StringBuilder();
                BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
                while ((line = errorReader.readLine()) != null) {
                    errorContent.append(line).append("\n");
                }
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Database Backup Failed. Ensure 'mysqldump' is in your system PATH.\nError Details:\n" + errorContent.toString());
            }

            byte[] sqlBytes = backupContent.toString().getBytes();
            
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "sunshine_db_backup_" + timestamp + ".sql";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(sqlBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Exception during backup: " + e.getMessage());
        }
    }
}
