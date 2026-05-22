// URL Encoder/Decoder Tool
function encodeURL() {
    const input = document.getElementById('urlInput').value;
    if (!input) {
        showToast('Please enter a URL or text to encode!', 'warning');
        return;
    }
    
    try {
        const encoded = encodeURIComponent(input);
        document.getElementById('urlOutput').textContent = encoded;
        showToast('URL encoded!');
    } catch (e) {
        showToast('Error encoding: ' + e.message, 'error');
    }
}

function decodeURL() {
    const input = document.getElementById('urlInput').value;
    if (!input) {
        showToast('Please enter an encoded URL to decode!', 'warning');
        return;
    }
    
    try {
        const decoded = decodeURIComponent(input);
        document.getElementById('urlOutput').textContent = decoded;
        showToast('URL decoded!');
    } catch (e) {
        showToast('Invalid encoded URL!', 'error');
    }
}

function copyResult() {
    const result = document.getElementById('urlOutput').textContent;
    if (result) {
        copyToClipboard(result);
    } else {
        showToast('No result to copy!', 'warning');
    }
}

function clearAll() {
    document.getElementById('urlInput').value = '';
    document.getElementById('urlOutput').textContent = '';
}
