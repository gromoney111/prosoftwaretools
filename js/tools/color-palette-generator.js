// Color Palette Generator Tool
const baseColorInput = document.getElementById('baseColor');
const baseColorHex = document.getElementById('baseColorHex');

baseColorInput.addEventListener('input', function() {
    baseColorHex.value = this.value;
    generatePalette();
});

baseColorHex.addEventListener('input', function() {
    if (/^#[0-9a-fA-F]{6}$/.test(this.value)) {
        baseColorInput.value = this.value;
        generatePalette();
    }
});

// Generate on load
document.addEventListener('DOMContentLoaded', generatePalette);

function generatePalette() {
    const hex = baseColorInput.value;
    const hsl = hexToHSL(hex);
    const output = document.getElementById('palettesOutput');

    const harmonies = [
        { name: 'Complementary', colors: getComplementary(hsl) },
        { name: 'Analogous', colors: getAnalogous(hsl) },
        { name: 'Triadic', colors: getTriadic(hsl) },
        { name: 'Split-Complementary', colors: getSplitComplementary(hsl) },
        { name: 'Monochromatic', colors: getMonochromatic(hsl) }
    ];

    let html = '';
    harmonies.forEach(harmony => {
        html += '<div class="result-box" style="margin-top:20px;">';
        html += '<h3>' + harmony.name + '</h3>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:10px;">';
        harmony.colors.forEach(color => {
            const rgb = hexToRGB(color);
            html += '<div style="cursor:pointer;text-align:center;" onclick="copyColor(\'' + color + '\')">';
            html += '<div style="width:80px;height:80px;background:' + color + ';border-radius:10px;border:2px solid #e0e0e0;margin-bottom:5px;"></div>';
            html += '<span style="font-size:0.75rem;font-weight:600;display:block;">' + color.toUpperCase() + '</span>';
            html += '<span style="font-size:0.7rem;color:#666;">rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')</span>';
            html += '</div>';
        });
        html += '</div></div>';
    });

    output.innerHTML = html;
}

function randomPalette() {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    baseColorInput.value = randomHex;
    baseColorHex.value = randomHex;
    generatePalette();
}

function exportCSS() {
    const hex = baseColorInput.value;
    const hsl = hexToHSL(hex);
    const all = [
        ...getComplementary(hsl),
        ...getAnalogous(hsl),
        ...getTriadic(hsl),
        ...getSplitComplementary(hsl),
        ...getMonochromatic(hsl)
    ];
    const unique = [...new Set(all)];
    let css = ':root {\n';
    unique.forEach((color, i) => {
        css += '  --color-' + (i + 1) + ': ' + color + ';\n';
    });
    css += '}\n';
    copyToClipboard(css);
}

function copyColor(color) {
    copyToClipboard(color);
}

// Color conversion utilities
function hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
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
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r, g, b;

    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hexToRGB(hex) {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
    };
}

// Harmony generators
function getComplementary(hsl) {
    return [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex(hsl.h + 180, hsl.s, hsl.l)
    ];
}

function getAnalogous(hsl) {
    return [
        hslToHex(hsl.h - 30, hsl.s, hsl.l),
        hslToHex(hsl.h - 15, hsl.s, hsl.l),
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex(hsl.h + 15, hsl.s, hsl.l),
        hslToHex(hsl.h + 30, hsl.s, hsl.l)
    ];
}

function getTriadic(hsl) {
    return [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex(hsl.h + 120, hsl.s, hsl.l),
        hslToHex(hsl.h + 240, hsl.s, hsl.l)
    ];
}

function getSplitComplementary(hsl) {
    return [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex(hsl.h + 150, hsl.s, hsl.l),
        hslToHex(hsl.h + 210, hsl.s, hsl.l)
    ];
}

function getMonochromatic(hsl) {
    return [
        hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 30, 10)),
        hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 15, 10)),
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 90)),
        hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 30, 90))
    ];
}
