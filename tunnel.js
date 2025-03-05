const ngrok = require('ngrok');
const QRCode = require('qrcode');
const fs = require('fs');

async function generateNgrokQR() {
    try {
        // Create an ngrok tunnel and get the public URL
        const publicUrl = await ngrok.connect({
            addr: 3000, 
            authtoken: process.env.NGROK_AUTHTOKEN // Ensure you have this set in your environment variables
        });

        console.log(`Terminal Tunnel URL: ${publicUrl}`);

        // Generate QR code and save as an image
        QRCode.toFile('ngrok_qr.png', publicUrl, {
            errorCorrectionLevel: 'L',
            scale: 10,
            margin: 4
        }, (err) => {
            if (err) throw err;
            console.log('QR code saved as ngrok_qr.png');
        });
    } catch (error) {
        console.error('Error creating ngrok tunnel:', error);
    }
}

generateNgrokQR();