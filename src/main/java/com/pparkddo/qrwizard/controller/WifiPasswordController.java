package com.pparkddo.qrwizard.controller;

import com.pparkddo.qrwizard.service.QrReaderService;
import com.pparkddo.qrwizard.service.WifiPasswordExtractorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

@Controller
@RequiredArgsConstructor
@RequestMapping("/wifi-password")
public class WifiPasswordController {

    private final QrReaderService qrReaderService;
    private final WifiPasswordExtractorService wifiPasswordExtractorService;

    @GetMapping("/find-by-file")
    public String findWifiPasswordByFile() {
        return "/wifi-password/find-by-file";
    }

    @PostMapping("/find-by-file")
    public ModelAndView findWifiPassword(@RequestParam MultipartFile file) {
        ModelAndView mv = new ModelAndView(new RedirectView("/wifi-password/show"));
        String extractedQrValue = qrReaderService.extractQrValue(file);
        mv.addObject("pw", wifiPasswordExtractorService.extractPassword(extractedQrValue));
        return mv;
    }

    @GetMapping("/show")
    public String showWifiPasswordResult(@RequestParam String pw) {
        return "/wifi-password/show";
    }
}
