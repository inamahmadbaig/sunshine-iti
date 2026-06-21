package com.sunshine.iti.repository;

import com.sunshine.iti.model.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    List<ExamResult> findByAdmissionDetailIdOrderBySemesterOrYearDesc(Long admissionId);
}
