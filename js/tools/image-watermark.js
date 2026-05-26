// Image Watermark Tool
let watermarkImage = null;

document.getElementById('wmImageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            watermarkImage = img;
            document.getElementById('wmPreviewImg').src = event.target.result;
            document.getElementById('wmImagePreview').style.display = 'block';
            applyWatermark();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function applyWatermark() {
    if (!watermarkImage) {
        showToast('Please upload an image first!', 'warning');
        return;
    }
    
    const text = document.getElementById('wmText').value || 'ProSoftwareTools';
    const fontSize = parseInt(document.getElementById('wmFontSize').value) || 30;
    const opacity = parseInt(document.getElementById('wmOpacity').value) / 100;
    const color = document.getElementById('wmColor').value;
    const position = document.getElementById('wmPosition').value;
    
    const canvas = document.getElementById('wmCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = watermarkImage.width;
    canvas.height = watermarkImage.height;
    
    // Draw image
    ctx.drawImage(watermarkImage, 0, 0);
    
    // Configure watermark
    ctx.font = `bold ${fontSize}px Inter, Arial`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    
    // Add shadow for visibility
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    
    const textWidth = ctx.measureText(text).width;
    const padding = 20;
    let x, y;
    
    switch(position) {
        case 'top-left':
            x = padding; y = fontSize + padding;
            ctx.textAlign = 'left'; break;
        case 'top-right':
            x = canvas.width - padding; y = fontSize + padding;
            ctx.textAlign = 'right'; break;
        case 'bottom-left':
            x = padding; y = canvas.height - padding;
            ctx.textAlign = 'left'; break;
        case 'bottom-right':
            x = canvas.width - padding; y = canvas.height - padding;
            ctx.textAlign = 'right'; break;
        case 'center':
            x = canvas.width / 2; y = canvas.height / 2;
            ctx.textAlign = 'center'; break;
        case 'tile':
            ctx.textAlign = 'center';
            for (let i = 0; i < canvas.width; i += textWidth + 100) {
                for (let j = 0; j < canvas.height; j += fontSize * 3) {
                    ctx.save();
                    ctx.translate(i, j);
                    ctx.rotate(-Math.PI / 6);
                    ctx.fillText(text, 0, 0);
                    ctx.restore();
                }
            }
            document.getElementById('wmResult').style.display = 'block';
            return;
    }
    
    ctx.fillText(text, x, y);
    document.getElementById('wmResult').style.display = 'block';
}

function downloadWatermarked() {
    const canvas = document.getElementById('wmCanvas');
    if (canvas.width === 0) {
        showToast('Apply watermark first!', 'warning');
        return;
    }
    const link = document.createElement('a');
    link.download = 'watermarked-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Image downloaded!');
}
