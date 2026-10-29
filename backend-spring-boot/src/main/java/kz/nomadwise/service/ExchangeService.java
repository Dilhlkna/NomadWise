package kz.nomadwise.service;

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
}
