package kz.nomadwise.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class CurrencyApiService {

    @Value("\${currency.api.frankfurter.url:https://api.frankfurter.app}")
    private String frankfurterUrl;

    @Value("\${currency.api.open-er.url:https://open.er-api.com/v6/latest/USD}")
    private String openErUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, BigDecimal> cachedUsdRates = new ConcurrentHashMap<>();

    public CurrencyApiService() {
        // Бастапқы резервтік нарықтық бағамдар (1 USD = ...)
        cachedUsdRates.put("USD", BigDecimal.ONE);
        cachedUsdRates.put("KZT", new BigDecimal("498.60"));
        cachedUsdRates.put("EUR", new BigDecimal("0.9220"));
        cachedUsdRates.put("GBP", new BigDecimal("0.7840"));
        cachedUsdRates.put("RUB", new BigDecimal("95.80"));
        cachedUsdRates.put("CNY", new BigDecimal("7.140"));
        cachedUsdRates.put("AED", new BigDecimal("3.6725"));
        cachedUsdRates.put("TRY", new BigDecimal("34.25"));
    }

    public BigDecimal getExchangeRate(String from, String to) {
        if (from.equalsIgnoreCase(to)) {
            return BigDecimal.ONE;
        }

        BigDecimal usdToFrom = cachedUsdRates.getOrDefault(from.toUpperCase(), BigDecimal.ONE);
        BigDecimal usdToTarget = cachedUsdRates.getOrDefault(to.toUpperCase(), BigDecimal.ONE);

        // Cross-rate: target / from
        return usdToTarget.divide(usdToFrom, 6, RoundingMode.HALF_EVEN);
    }
}
