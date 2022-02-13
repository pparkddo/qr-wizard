package com.pparkddo.qrwizard.service;

import com.google.zxing.BinaryBitmap;
import com.google.zxing.ChecksumException;
import com.google.zxing.FormatException;
import com.google.zxing.NotFoundException;
import com.google.zxing.Result;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeReader;
import com.pparkddo.qrwizard.exception.QrException;
import java.awt.image.BufferedImage;
import java.io.IOException;
import javax.imageio.ImageIO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class QrReaderService {

    public String extractQrValue(MultipartFile multipartFile) {
        BinaryBitmap binaryBitmap = convertToBinaryBitmap(multipartFile);
        return extract(binaryBitmap);
    }

    private BinaryBitmap convertToBinaryBitmap(MultipartFile multipartFile) {
        try {
            BufferedImage bufferedImage = ImageIO.read(multipartFile.getInputStream());
            BufferedImageLuminanceSource bufferedImageLuminanceSource =
                new BufferedImageLuminanceSource(bufferedImage);
            HybridBinarizer hybridBinarizer = new HybridBinarizer(bufferedImageLuminanceSource);
            return new BinaryBitmap(hybridBinarizer);
        } catch (IOException e) {
            throw new QrException("파일을 읽을 수 없어요");
        }
    }

    private String extract(BinaryBitmap binaryBitmap) {
        try {
            Result result = new QRCodeReader().decode(binaryBitmap);
            return result.getText();
        } catch (NotFoundException | ChecksumException | FormatException e) {
            throw new QrException("QR 코드를 해석할 수 없어요");
        }
    }
}
