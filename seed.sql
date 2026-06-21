-- SQL Seed script for study_materials in iti2 database

INSERT INTO iti2.study_materials (title, trade, type, file_name, file_type, file_data, uploaded_at) VALUES
('Electrician Syllabus NCVT 2026', 'Electrician', 'SYLLABUS', 'electrician_syllabus.pdf', 'application/pdf', '%PDF-1.4 dummy pdf for Electrician Syllabus NCVT 2026', NOW(6)),
('DCA Course Scheme and Syllabus', 'DCA', 'SYLLABUS', 'dca_syllabus.pdf', 'application/pdf', '%PDF-1.4 dummy pdf for DCA Course Scheme and Syllabus', NOW(6)),
('Health Sanitary Inspector Syllabus', 'Health Sanitary Inspector', 'SYLLABUS', 'hsi_syllabus.pdf', 'application/pdf', '%PDF-1.4 dummy pdf for Health Sanitary Inspector Syllabus', NOW(6)),
('PGDCA Course Scheme and Syllabus', 'PGDCA', 'SYLLABUS', 'pgdca_syllabus.pdf', 'application/pdf', '%PDF-1.4 dummy pdf for PGDCA Course Scheme and Syllabus', NOW(6)),

('Electrician Theory Paper 2025', 'Electrician', 'PREVIOUS_PAPER', 'electrician_theory_2025.pdf', 'application/pdf', '%PDF-1.4 dummy pdf for Electrician Theory Paper 2025', NOW(6)),
('DCA Computer Fundamentals 2025', 'DCA', 'PREVIOUS_PAPER', 'dca_fundamentals_2025.pdf', 'application/pdf', '%PDF-1.4 dummy pdf for DCA Computer Fundamentals 2025', NOW(6)),
('HSI Workshop Calculation Paper 2024', 'Health Sanitary Inspector', 'PREVIOUS_PAPER', 'hsi_workshop_calc_2024.pdf', 'application/pdf', '%PDF-1.4 dummy pdf for HSI Workshop Calculation Paper 2024', NOW(6)),

('MP Post Matric Scholarship Form', 'All Trades', 'SCHOLARSHIP', 'mp_scholarship_form_2026.pdf', 'application/pdf', '%PDF-1.4 dummy pdf for MP Post Matric Scholarship Form', NOW(6)),
('National Scholarship Portal (NSP) Manual', 'All Trades', 'SCHOLARSHIP', 'nsp_user_manual.pdf', 'application/pdf', '%PDF-1.4 dummy pdf for National Scholarship Portal (NSP) Manual', NOW(6)),

('Academic Calendar 2026-27 (Sunshine ITI)', 'All Trades', 'CALENDAR', 'academic_calendar_2026_27.pdf', 'application/pdf', '%PDF-1.4 dummy pdf for Academic Calendar 2026-27 (Sunshine ITI)', NOW(6)),
('Examination & Practical Training Schedule 2026', 'All Trades', 'CALENDAR', 'exam_training_calendar_2026.pdf', 'application/pdf', '%PDF-1.4 dummy pdf for Examination & Practical Training Schedule 2026', NOW(6)),

('Sunshine ITI Code of Conduct & Rules', 'All Trades', 'RULES', 'college_rules_and_regulations.pdf', 'application/pdf', '%PDF-1.4 dummy pdf for Sunshine ITI Code of Conduct & Rules', NOW(6)),
('Anti-Ragging Affidavits & Guidelines', 'All Trades', 'RULES', 'anti_ragging_rules.pdf', 'application/pdf', '%PDF-1.4 dummy pdf for Anti-Ragging Affidavits & Guidelines', NOW(6));
