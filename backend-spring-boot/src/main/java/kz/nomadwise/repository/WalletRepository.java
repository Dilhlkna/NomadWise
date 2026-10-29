package kz.nomadwise.repository;

import kz.nomadwise.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    List<Wallet> findByUserId(Long userId);
    Optional<Wallet> findByUserIdAndCurrencyCode(Long userId, String currencyCode);
    boolean existsByVirtualCardNumber(String virtualCardNumber);
}
