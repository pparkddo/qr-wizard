package com.pparkddo.qrwizard.service;

import org.springframework.stereotype.Service;

@Service
public class WifiPasswordExtractorService {

    private static final String DELIMITER = ";";
    private static final String PASSWORD_PREFIX = "P:";

    public String extractPassword(String text) {
        return text.split(DELIMITER)[2].split(PASSWORD_PREFIX)[1];
    }
}
