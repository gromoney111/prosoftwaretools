// Color Picker Tool
const colorInput = document.getElementById('colorInput');
const colorDisplay = document.getElementById('colorDisplay');
const hexInput = document.getElementById('hexInput');

colorInput.addEventListener('input', function() {
    updateColor(this.value);
});

function updateColor(hex) {
    colorDisplay.style.background = hex;
    document.getElementById('hexValue').textContent = hex;
    hexInput.value = hex;
    
    // Convert to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    document.getElementById('rgbValue').textContent = `rgb(${r}, ${g}, ${b})`;
    
    // Convert to HSL
    const hsl = rgbToHsl(r, g, b);
    document.getElementById('hslValue').textContent = 
        `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function applyHex() {
    let hex = hexInput.value.trim();
    if (!hex.startsWith('#')) hex = '#' + hex;
    
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        colorInput.value = hex;
        updateColor(hex);
        showToast('Color applied!');
    } else {
        showToast('Invalid HEX color code!', 'error');
    }
}

function copyHex() {
    copyToClipboard(document.getElementById('hexValue').textContent);
}

function copyRgb() {
    copyToClipboard(document.getElementById('rgbValue').textContent);
}

function copyHsl() {
    copyToClipboard(document.getElementById('hslValue').textContent);
}
