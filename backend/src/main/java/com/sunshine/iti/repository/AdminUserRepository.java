package com.sunshine.iti.repository;

import com.sunshine.iti.model.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findFirstByUsername(String username);
    Optional<AdminUser> findFirstByEmail(String email);
}
