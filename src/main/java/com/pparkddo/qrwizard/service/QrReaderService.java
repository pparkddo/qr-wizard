package com.pparkddo.qrwizard.service;

import com.google.zxing.BinaryBitmap;
import com.google.zxing.ChecksumException;
import com.google.zxing.FormatException;
import com.google.zxing.NotFoundException;
import com.google.zxing.Result;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeReader;
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
        BinaryBitmap binaryBitmap = null;
        try {
            BufferedImage bufferedImage = ImageIO.read(multipartFile.getInputStream());
            BufferedImageLuminanceSource bufferedImageLuminanceSource =
                new BufferedImageLuminanceSource(bufferedImage);
            HybridBinarizer hybridBinarizer = new HybridBinarizer(bufferedImageLuminanceSource);
            binaryBitmap = new BinaryBitmap(hybridBinarizer);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return binaryBitmap;
    }

    private String extract(BinaryBitmap binaryBitmap) {
        String value = null;
        try {
            Result result = new QRCodeReader().decode(binaryBitmap);
            value = result.getText();
        } catch (NotFoundException e) {
            e.printStackTrace();
        } catch (ChecksumException e) {
            e.printStackTrace();
        } catch (FormatException e) {
            e.printStackTrace();
        }
        return value;
    }
}
