package kz.nomadwise.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 3)
    private String currencyCode;

    @Column(nullable = false, precision = 18, scale = 4)
    private BigDecimal balance;

    @Column(nullable = false)
    private String cardholderName;

    @Column(nullable = false, unique = true, length = 19)
    private String virtualCardNumber;

    @Column(nullable = false, length = 5)
    private String expiryDate;

    @Column(nullable = false)
    private Boolean isFrozen;

    private String cardTheme;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.balance == null) this.balance = BigDecimal.ZERO;
        if (this.isFrozen == null) this.isFrozen = false;
        if (this.cardTheme == null) this.cardTheme = "forest";
    }
}
