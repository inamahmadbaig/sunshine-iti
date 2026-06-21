package com.sunshine.iti.repository;

import com.sunshine.iti.model.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findTopByEmailOrderByExpiryTimeDesc(String email);
    void deleteByEmail(String email);
}
