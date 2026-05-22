// QR Code Generator Tool
let qrcode = null;

function generateQR() {
    const text = document.getElementById('qrInput').value.trim();
    if (!text) {
        showToast('Please enter a URL or text!', 'warning');
        return;
    }
    
    const qrResult = document.getElementById('qrResult');
    qrResult.innerHTML = '';
    
    qrcode = new QRCode(qrResult, {
        text: text,
        width: 256,
        height: 256,
        colorDark: '#1e293b',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
    
    showToast('QR Code generated successfully!');
}

function downloadQR() {
    const qrResult = document.getElementById('qrResult');
    const canvas = qrResult.querySelector('canvas');
    const img = qrResult.querySelector('img');
    
    if (canvas) {
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('QR Code downloaded!');
    } else if (img) {
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = img.src;
        link.click();
        showToast('QR Code downloaded!');
    } else {
        showToast('Generate a QR code first!', 'warning');
    }
}

function clearQR() {
    document.getElementById('qrInput').value = '';
    document.getElementById('qrResult').innerHTML = '<p style="color:var(--gray);">Enter text or URL above and click Generate</p>';
    qrcode = null;
}
