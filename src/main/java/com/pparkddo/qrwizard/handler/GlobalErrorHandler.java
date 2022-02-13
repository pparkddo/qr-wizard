package com.pparkddo.qrwizard.handler;

import com.pparkddo.qrwizard.exception.QrException;
import com.pparkddo.qrwizard.exception.WifiQrExtractionException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;

@ControllerAdvice
class GlobalErrorHandler {

    @ExceptionHandler(QrException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ModelAndView handleQrException(QrException e) {
        ModelAndView mv = new ModelAndView("/qr-error");
        mv.addObject("message", e.getMessage());
        return mv;
    }

    @ExceptionHandler(WifiQrExtractionException.class)
    protected ModelAndView handleWifiQrExtractionException(WifiQrExtractionException e) {
        ModelAndView mv = new ModelAndView("/wifi-password/wifi-qr-extraction-error");
        String message = "QR 에서 와이파이 비밀번호를 추출할 수 없어요."
            + "\n올바른 와이파이 QR 이미지가 아닐 수 있어요.";
        mv.addObject("message", message);
        mv.addObject("qrData", e.getMessage());
        return mv;
    }
}
