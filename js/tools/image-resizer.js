// Image Resizer Tool
let originalImage = null;
let originalWidth = 0;
let originalHeight = 0;

document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            originalWidth = img.width;
            originalHeight = img.height;
            
            document.getElementById('previewImg').src = event.target.result;
            document.getElementById('imagePreview').style.display = 'block';
            document.getElementById('originalSize').textContent = 
                `Original: ${img.width} x ${img.height} px`;
            document.getElementById('resizeWidth').value = img.width;
            document.getElementById('resizeHeight').value = img.height;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Maintain aspect ratio
document.getElementById('resizeWidth').addEventListener('input', function() {
    if (document.getElementById('maintainRatio').checked && originalWidth > 0) {
        const ratio = originalHeight / originalWidth;
        document.getElementById('resizeHeight').value = Math.round(this.value * ratio);
    }
});

document.getElementById('resizeHeight').addEventListener('input', function() {
    if (document.getElementById('maintainRatio').checked && originalHeight > 0) {
        const ratio = originalWidth / originalHeight;
        document.getElementById('resizeWidth').value = Math.round(this.value * ratio);
    }
});

function resizeImage() {
    if (!originalImage) {
        showToast('Please upload an image first!', 'warning');
        return;
    }
    
    const newWidth = parseInt(document.getElementById('resizeWidth').value);
    const newHeight = parseInt(document.getElementById('resizeHeight').value);
    
    if (!newWidth || !newHeight || newWidth <= 0 || newHeight <= 0) {
        showToast('Please enter valid dimensions!', 'error');
        return;
    }
    
    const canvas = document.getElementById('resizeCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);
    
    document.getElementById('resultPreview').style.display = 'block';
    document.getElementById('newSize').textContent = 
        `Resized: ${newWidth} x ${newHeight} px`;
    
    showToast('Image resized successfully!');
}

function downloadImage() {
    const canvas = document.getElementById('resizeCanvas');
    if (canvas.width === 0) {
        showToast('Resize an image first!', 'warning');
        return;
    }
    
    const link = document.createElement('a');
    link.download = 'resized-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Image downloaded!');
}
