package kz.nomadwise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * NomadWise Currency Exchange & Virtual Wallet Engine
 * Java 21 & Spring Boot 3.3.4
 */
@SpringBootApplication
@EnableScheduling
public class NomadWiseApplication {

    public static void main(String[] args) {
        SpringApplication.run(NomadWiseApplication.class, args);
    }
}
