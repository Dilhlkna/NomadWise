package kz.nomadwise.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExchangeExecuteRequest {

    @NotNull(message = "Бастапқы әмиян ID міндетті")
    private Long sourceWalletId;

    @NotNull(message = "Мақсатты әмиян ID міндетті")
    private Long targetWalletId;

    @NotNull(message = "Сома міндетті")
    @DecimalMin(value = "0.01", message = "Сома кемінде 0.01 болуы тиіс")
    private BigDecimal sourceAmount;
}
