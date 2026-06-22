package com.sunshine.iti.repository;

import com.sunshine.iti.model.AdmissionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AdmissionDetailRepository extends JpaRepository<AdmissionDetail, Long> {
    Optional<AdmissionDetail> findByIdAndDob(Long id, LocalDate dob);
    Optional<AdmissionDetail> findByMobileAndDob(String mobile, LocalDate dob);
    Optional<AdmissionDetail> findByFullNameIgnoreCaseAndMobileAndDob(String fullName, String mobile, LocalDate dob);
}
