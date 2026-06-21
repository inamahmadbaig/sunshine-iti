package com.sunshine.iti.repository;

import com.sunshine.iti.model.AdmissionApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdmissionApplicationRepository extends JpaRepository<AdmissionApplication, Long> {
}
