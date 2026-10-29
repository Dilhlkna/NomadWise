package kz.nomadwise.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "currencies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Currency {

    @Id
    @Column(length = 3)
    private String code;

    @Column(nullable = false, length = 80)
    private String nameKz;

    @Column(nullable = false, length = 80)
    private String nameEn;

    @Column(nullable = false, length = 10)
    private String symbol;

    private Integer decimalPlaces;
    private Boolean isActive;
}
