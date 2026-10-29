package kz.nomadwise.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExchangePreviewResponse {
    private String fromCurrency;
    private String toCurrency;
    private BigDecimal sourceAmount;
    private BigDecimal rate;
    private BigDecimal feePercentage;
    private BigDecimal feeAmount;
    private BigDecimal targetAmount;
    private Integer guaranteeSeconds;
}
