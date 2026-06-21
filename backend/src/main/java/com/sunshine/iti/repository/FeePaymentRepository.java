package com.sunshine.iti.repository;

import com.sunshine.iti.model.FeePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeePaymentRepository extends JpaRepository<FeePayment, Long> {
    List<FeePayment> findByAdmissionDetailIdOrderByPaymentDateDesc(Long admissionId);
    List<FeePayment> findByStatusOrderBySubmittedAtDesc(String status);
    List<FeePayment> findAllByOrderBySubmittedAtDesc();
}
