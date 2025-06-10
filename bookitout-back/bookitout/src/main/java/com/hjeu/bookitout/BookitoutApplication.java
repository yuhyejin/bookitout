package com.hjeu.bookitout;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BookitoutApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookitoutApplication.class, args);
    }

}
