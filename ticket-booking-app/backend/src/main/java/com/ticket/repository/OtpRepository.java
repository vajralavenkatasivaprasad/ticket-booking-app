package com.ticket.repository;

import com.ticket.model.OtpRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpRecord, Long> {
    Optional<OtpRecord> findTopByEmailOrderByExpiresAtDesc(String email);

    @Modifying
    @Transactional
    @Query("DELETE FROM OtpRecord o WHERE o.email = :email")
    void deleteByEmail(String email);

    @Modifying
    @Transactional
    @Query("DELETE FROM OtpRecord o WHERE o.expiresAt < :now")
    void deleteExpiredRecords(LocalDateTime now);
}
