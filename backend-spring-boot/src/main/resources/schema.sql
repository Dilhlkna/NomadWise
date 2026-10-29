-- ===================================================================
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Currencies кестесі (Қолдау көрсетілетін валюталар)
CREATE TABLE IF NOT EXISTS currencies (
    code VARCHAR(3) PRIMARY KEY,
    name_kz VARCHAR(80) NOT NULL,
    name_en VARCHAR(80) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    decimal_places INT DEFAULT 2,
    is_active BOOLEAN DEFAULT TRUE
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_wallets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_wallets_currency FOREIGN KEY (currency_code) REFERENCES currencies(code),
    CONSTRAINT chk_wallet_balance CHECK (balance >= 0.0000),
    INDEX idx_wallets_user_id (user_id),
    INDEX idx_wallets_currency (currency_code)
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
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS', -- 'SUCCESS', 'FAILED', 'PENDING'
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tx_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_tx_source_wallet FOREIGN KEY (source_wallet_id) REFERENCES wallets(id),
    CONSTRAINT fk_tx_target_wallet FOREIGN KEY (target_wallet_id) REFERENCES wallets(id),
    INDEX idx_tx_user_created (user_id, created_at DESC),
    INDEX idx_tx_reference (reference_code)
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

-- 6. User Preferences кестесі (Қолданушы баптаулары)
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id BIGINT PRIMARY KEY,
    theme VARCHAR(20) DEFAULT 'light',
    notification_email BOOLEAN DEFAULT TRUE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_pref_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Бастапқы валюталарды толтыру
INSERT INTO currencies (code, name_kz, name_en, symbol, decimal_places) VALUES
('KZT', 'Қазақстан теңгесі', 'Kazakhstani Tenge', '₸', 2),
('USD', 'АҚШ доллары', 'US Dollar', '$', 2),
('EUR', 'Еуро', 'Euro', '€', 2),
('GBP', 'Британ фунты', 'British Pound', '£', 2),
('RUB', 'Ресей рублі', 'Russian Ruble', '₽', 2),
('CNY', 'Қытай юаны', 'Chinese Yuan', '¥', 2),
('AED', 'БАӘ дирхамы', 'UAE Dirham', 'AED', 2),
('TRY', 'Түрік лирасы', 'Turkish Lira', '₺', 2)
ON DUPLICATE KEY UPDATE name_kz=VALUES(name_kz);
