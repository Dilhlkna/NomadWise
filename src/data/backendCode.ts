export interface BackendFile {
  id: string;
  category: 'config' | 'entity' | 'repository' | 'service' | 'controller' | 'security' | 'database' | 'docs';
  filename: string;
  path: string;
  language: string;
  descriptionKz: string;
  code: string;
}

export const BACKEND_CODE_FILES: BackendFile[] = [
  {
    id: 'pom-xml',
    category: 'config',
    filename: 'pom.xml',
    path: 'pom.xml',
    language: 'xml',
    descriptionKz: 'Maven тәуелділіктері (Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA, MySQL Connector, Lombok, Validation)',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/>
    </parent>
    
    <groupId>kz.nomadwise</groupId>
    <artifactId>nomadwise-exchange-api</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>NomadWise Currency Exchange Platform</name>
    <description>Wise-style multi-currency virtual card & exchange engine in Java 21</description>
    
    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.12.5</jjwt.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- MySQL Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- JWT for Stateless REST API Authentication -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`,
  },
  {
    id: 'application-props',
    category: 'config',
    filename: 'application.properties',
    path: 'src/main/resources/application.properties',
    language: 'properties',
    descriptionKz: 'MySQL байланысы, JPA транзакциялары, сыртқы Frankfurter API баптаулары',
    code: `# Server Configuration
server.port=8080

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/nomadwise_db?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8&allowPublicKeyRetrieval=true
spring.datasource.username=nomad_user
spring.datasource.password=SecurePassword123!
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA & Hibernate Settings
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# External Currency API
currency.api.frankfurter.url=https://api.frankfurter.app
currency.api.open-er.url=https://open.er-api.com/v6/latest/USD

# Wise Exchange Business Fee Configuration
nomadwise.exchange.fee-percentage=0.45
nomadwise.exchange.guarantee-duration-seconds=30

# JWT Security Configuration
nomadwise.jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
nomadwise.jwt.expiration-ms=86400000`,
  },
  {
    id: 'schema-sql',
    category: 'database',
    filename: 'schema.sql',
    path: 'src/main/resources/schema.sql',
    language: 'sql',
    descriptionKz: 'MySQL 8+ DDL скрипті: кестелер, сыртқы кілттер (FK), DECIMAL дәлдігі және индекстер',
    code: `-- ===================================================================
-- NomadWise MySQL Database Schema (Талап 12 сәйкес)
-- Қауіпсіздік: Сыртқы кілттер, DECIMAL(18,4) дәлдігі, бірегей индекстер
-- ===================================================================

CREATE DATABASE IF NOT EXISTS nomadwise_db 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE nomadwise_db;

-- 1. Users кестесі (Қолданушылар)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    country VARCHAR(60) DEFAULT 'Kazakhstan',
    preferred_currency VARCHAR(3) DEFAULT 'KZT',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Currencies кестесі (Қолдау көрсетілетін валюталар)
CREATE TABLE IF NOT EXISTS currencies (
    code VARCHAR(3) PRIMARY KEY,
    name_kz VARCHAR(80) NOT NULL,
    name_en VARCHAR(80) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    decimal_places INT DEFAULT 2
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Wallets кестесі (Виртуалды әмияндар мен карталар)
CREATE TABLE IF NOT EXISTS wallets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    balance DECIMAL(18, 4) NOT NULL DEFAULT 0.0000,
    cardholder_name VARCHAR(100) NOT NULL,
    virtual_card_number VARCHAR(19) NOT NULL UNIQUE,
    expiry_date VARCHAR(5) NOT NULL,
    is_frozen BOOLEAN DEFAULT FALSE,
    card_theme VARCHAR(30) DEFAULT 'forest',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wallets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_wallets_currency FOREIGN KEY (currency_code) REFERENCES currencies(code),
    CONSTRAINT chk_wallet_balance CHECK (balance >= 0.0000),
    INDEX idx_wallets_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Transactions кестесі (Айырбастау және толықтыру операциялары)
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reference_code VARCHAR(32) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    type VARCHAR(30) NOT NULL, -- 'EXCHANGE', 'DEMO_DEPOSIT'
    source_wallet_id BIGINT NULL,
    target_wallet_id BIGINT NOT NULL,
    source_currency VARCHAR(3) NOT NULL,
    target_currency VARCHAR(3) NOT NULL,
    source_amount DECIMAL(18, 4) NOT NULL,
    target_amount DECIMAL(18, 4) NOT NULL,
    exchange_rate DECIMAL(18, 6) NOT NULL,
    fee_amount DECIMAL(18, 4) NOT NULL DEFAULT 0.0000,
    fee_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tx_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_tx_source_wallet FOREIGN KEY (source_wallet_id) REFERENCES wallets(id),
    CONSTRAINT fk_tx_target_wallet FOREIGN KEY (target_wallet_id) REFERENCES wallets(id),
    INDEX idx_tx_user_created (user_id, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Exchange Rates кестесі (Кэштелген валюта бағамдары)
CREATE TABLE IF NOT EXISTS exchange_rates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    base_currency VARCHAR(3) NOT NULL,
    target_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(18, 6) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_currency_pair (base_currency, target_currency)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. User Preferences кестесі
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id BIGINT PRIMARY KEY,
    theme VARCHAR(20) DEFAULT 'light',
    notification_email BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_pref_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
  },
  {
    id: 'user-entity',
    category: 'entity',
    filename: 'User.java',
    path: 'src/main/java/kz/nomadwise/entity/User.java',
    language: 'java',
    descriptionKz: 'JPA Entity: Users кестесінің Java 21 класы',
    code: `package kz.nomadwise.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private String phone;
    private String country;
    private String preferredCurrency;
    private Boolean isActive;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Wallet> wallets = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isActive == null) this.isActive = true;
        if (this.preferredCurrency == null) this.preferredCurrency = "KZT";
    }
}`,
  },
  {
    id: 'wallet-entity',
    category: 'entity',
    filename: 'Wallet.java',
    path: 'src/main/java/kz/nomadwise/entity/Wallet.java',
    language: 'java',
    descriptionKz: 'JPA Entity: Виртуалды әмиян мен карта (BigDecimal баланс)',
    code: `package kz.nomadwise.entity;

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

    // Қаржылық есептеулерде тек қана BigDecimal қолданылады
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
}`,
  },
  {
    id: 'exchange-service',
    category: 'service',
    filename: 'ExchangeService.java',
    path: 'src/main/java/kz/nomadwise/service/ExchangeService.java',
    language: 'java',
    descriptionKz: 'Service Layer: Атомдық айырбастау логикасы, @Transactional және BigDecimal есептеулері',
    code: `package kz.nomadwise.service;

import kz.nomadwise.dto.ExchangeExecuteRequest;
import kz.nomadwise.dto.ExchangePreviewResponse;
import kz.nomadwise.entity.Transaction;
import kz.nomadwise.entity.Wallet;
import kz.nomadwise.exception.InsufficientBalanceException;
import kz.nomadwise.exception.ResourceNotFoundException;
import kz.nomadwise.repository.TransactionRepository;
import kz.nomadwise.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExchangeService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final CurrencyApiService currencyApiService;

    private static final BigDecimal FEE_PERCENT = new BigDecimal("0.45"); // 0.45% Wise fee
    private static final BigDecimal ONE_HUNDRED = new BigDecimal("100");

    public ExchangePreviewResponse calculatePreview(String fromCurrency, String toCurrency, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Сома 0-ден үлкен болуы тиіс");
        }

        BigDecimal rate = currencyApiService.getExchangeRate(fromCurrency, toCurrency);
        
        // Комиссия есептеу: amount * 0.45 / 100
        BigDecimal fee = amount.multiply(FEE_PERCENT)
                .divide(ONE_HUNDRED, 4, RoundingMode.HALF_EVEN);
        
        BigDecimal netAmount = amount.subtract(fee);
        BigDecimal targetAmount = netAmount.multiply(rate)
                .setScale(4, RoundingMode.HALF_EVEN);

        return ExchangePreviewResponse.builder()
                .fromCurrency(fromCurrency)
                .toCurrency(toCurrency)
                .sourceAmount(amount)
                .rate(rate)
                .feePercentage(FEE_PERCENT)
                .feeAmount(fee)
                .targetAmount(targetAmount)
                .guaranteeSeconds(30)
                .build();
    }

    /**
     * Атомдық валюта айырбастау операциясы.
     * Баланс жеткіліксіз болса немесе қате шықса, транзакция толық кері қайтарылады (Rollback).
     */
    @Transactional(isolation = Isolation.REPEATABLE_READ, rollbackFor = Exception.class)
    public Transaction executeExchange(Long userId, ExchangeExecuteRequest request) {
        Wallet sourceWallet = walletRepository.findById(request.getSourceWalletId())
                .orElseThrow(() -> new ResourceNotFoundException("Бастапқы әмиян табылмады"));

        Wallet targetWallet = walletRepository.findById(request.getTargetWalletId())
                .orElseThrow(() -> new ResourceNotFoundException("Мақсатты әмиян табылмады"));

        if (!sourceWallet.getUser().getId().equals(userId)) {
            throw new SecurityException("Бұл әмиянға қолжетімділік жоқ");
        }

        if (Boolean.TRUE.equals(sourceWallet.getIsFrozen()) || Boolean.TRUE.equals(targetWallet.getIsFrozen())) {
            throw new IllegalStateException("Бұғатталған әмиянмен операция жасауға тыйым салынған");
        }

        BigDecimal amount = request.getSourceAmount();
        if (sourceWallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Әмиянда қаражат жеткіліксіз. Қолжетімді: " + sourceWallet.getBalance());
        }

        ExchangePreviewResponse preview = calculatePreview(
                sourceWallet.getCurrencyCode(),
                targetWallet.getCurrencyCode(),
                amount
        );

        // 1. Бастапқы әмияннан қаражатты шегеру
        sourceWallet.setBalance(sourceWallet.getBalance().subtract(amount));
        walletRepository.save(sourceWallet);

        // 2. Мақсатты әмиянға қаражатты қосу
        targetWallet.setBalance(targetWallet.getBalance().add(preview.getTargetAmount()));
        walletRepository.save(targetWallet);

        // 3. Транзакция жазбасын сақтау
        Transaction transaction = Transaction.builder()
                .referenceCode("NW-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(sourceWallet.getUser())
                .type("EXCHANGE")
                .sourceWallet(sourceWallet)
                .targetWallet(targetWallet)
                .sourceCurrency(sourceWallet.getCurrencyCode())
                .targetCurrency(targetWallet.getCurrencyCode())
                .sourceAmount(amount)
                .targetAmount(preview.getTargetAmount())
                .exchangeRate(preview.getRate())
                .feeAmount(preview.getFeeAmount())
                .feePercentage(preview.getFeePercentage())
                .status("SUCCESS")
                .description(String.format("%s %s ➔ %s %s айырбасталды", 
                        amount, sourceWallet.getCurrencyCode(), 
                        preview.getTargetAmount(), targetWallet.getCurrencyCode()))
                .build();

        return transactionRepository.save(transaction);
    }
}`,
  },
  {
    id: 'exchange-controller',
    category: 'controller',
    filename: 'ExchangeController.java',
    path: 'src/main/java/kz/nomadwise/controller/ExchangeController.java',
    language: 'java',
    descriptionKz: 'REST API Controller: /api/exchange/preview және /api/exchange/execute',
    code: `package kz.nomadwise.controller;

import jakarta.validation.Valid;
import kz.nomadwise.dto.ExchangeExecuteRequest;
import kz.nomadwise.dto.ExchangePreviewResponse;
import kz.nomadwise.entity.Transaction;
import kz.nomadwise.service.ExchangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/exchange")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExchangeController {

    private final ExchangeService exchangeService;

    @GetMapping("/preview")
    public ResponseEntity<ExchangePreviewResponse> getPreview(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam BigDecimal amount
    ) {
        ExchangePreviewResponse preview = exchangeService.calculatePreview(from, to, amount);
        return ResponseEntity.ok(preview);
    }

    @PostMapping("/execute")
    public ResponseEntity<Transaction> executeExchange(
            @AuthenticationPrincipal Long currentUserId,
            @Valid @RequestBody ExchangeExecuteRequest request
    ) {
        Transaction result = exchangeService.executeExchange(currentUserId, request);
        return ResponseEntity.ok(result);
    }
}`,
  },
  {
    id: 'security-config',
    category: 'security',
    filename: 'SecurityConfig.java',
    path: 'src/main/java/kz/nomadwise/config/SecurityConfig.java',
    language: 'java',
    descriptionKz: 'Spring Security 6: BCryptPasswordEncoder, JWT Token Filter, Stateless Session',
    code: `package kz.nomadwise.config;

import kz.nomadwise.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Талап 5: Парольдерді BCrypt арқылы қауіпсіз хештеу
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/exchange/preview", "/api/exchange/rates").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}`,
  },
  {
    id: 'readme-guide',
    category: 'docs',
    filename: 'INTELLIJ_STARTUP_GUIDE.md',
    path: 'INTELLIJ_STARTUP_GUIDE.md',
    language: 'markdown',
    descriptionKz: 'Жобаны IntelliJ IDEA арқылы іске қосу, MySQL және REST API тестілеу нұсқаулығы',
    code: `# NomadWise: Java 21 & Spring Boot Жобасын Іске Қосу Нұсқаулығы

## 1. Талап етілетін құралдар
- **JDK 21** (Amazon Corretto 21 немесе Eclipse Temurin 21)
- **IntelliJ IDEA** (Ultimate немесе Community Edition)
- **MySQL Server 8.0+**
- **Maven 3.9+**

## 2. MySQL Дерекқорын Баптау
1. MySQL Workbench немесе терминал арқылы кіріңіз:
   \`\`\`bash
   mysql -u root -p
   \`\`\`
2. \`schema.sql\` файлын орындаңыз:
   \`\`\`sql
   CREATE DATABASE IF NOT EXISTS nomadwise_db CHARACTER SET utf8mb4;
   \`\`\`
3. \`application.properties\` файлындағы дерекқор паролін өз MySQL пароліңізге сәйкестендіріңіз:
   \`spring.datasource.password=СІЗДІҢ_ПАРОЛІҢІЗ\`

## 3. IntelliJ IDEA арқылы іске қосу қадамдары
1. IntelliJ IDEA бағдарламасын ашып, **File -> Open...** тармағын таңдаңыз.
2. \`pom.xml\` файлы бар жоба қалтасын таңдап, **Open as Project** батырмасын басыңыз.
3. Оң жақтағы **Maven** панелінен **Reload All Maven Projects** батырмасын басыңыз.
4. \`src/main/java/kz/nomadwise/NomadWiseApplication.java\` файлын ашып, жасыл **Run ▶** батырмасын басыңыз.
5. Сервер \`http://localhost:8080\` портында іске қосылады.

## 4. REST API Endpoint-терін тексеру (cURL мысалдары)
### А) Тіркелу:
\`\`\`bash
curl -X POST http://localhost:8080/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"fullName":"Арман Серікұлы","email":"arman@nomadwise.kz","password":"SecurePassword123!"}'
\`\`\`

### Ә) Бағамды алдын-ала есептеу (Preview):
\`\`\`bash
curl -X GET "http://localhost:8080/api/exchange/preview?from=USD&to=KZT&amount=100"
\`\`\`

### Б) Валюта айырбастауды орындау:
\`\`\`bash
curl -X POST http://localhost:8080/api/exchange/execute \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer СІЗДІҢ_JWT_ТОКЕНІҢІЗ" \\
  -d '{"sourceWalletId": 1, "targetWalletId": 2, "sourceAmount": 100.00}'
\`\`\`

## 5. Android қосымшасымен интеграциялау
- Барлық сұраныстар таза JSON пішімінде жіберіледі.
- Авторизация үшін \`Authorization: Bearer <token>\` қолданылады.
- Retrofit 2 арқылы Android Kotlin жобасында тікелей шақыруға болады.`,
  },
];
