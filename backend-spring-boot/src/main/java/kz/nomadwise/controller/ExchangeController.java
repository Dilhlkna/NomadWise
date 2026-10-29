package kz.nomadwise.controller;

import jakarta.validation.Valid;
import kz.nomadwise.dto.ExchangeExecuteRequest;
import kz.nomadwise.dto.ExchangePreviewResponse;
import kz.nomadwise.entity.Transaction;
import kz.nomadwise.service.ExchangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long currentUserId,
            @Valid @RequestBody ExchangeExecuteRequest request
    ) {
        Transaction result = exchangeService.executeExchange(currentUserId, request);
        return ResponseEntity.ok(result);
    }
}
