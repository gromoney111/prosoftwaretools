// Base64 Encoder/Decoder Tool
function encodeBase64() {
    const input = document.getElementById('base64Input').value;
    if (!input) {
        showToast('Please enter text to encode!', 'warning');
        return;
    }
    
    try {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        document.getElementById('base64Output').textContent = encoded;
        showToast('Encoded to Base64!');
    } catch (e) {
        showToast('Error encoding: ' + e.message, 'error');
    }
}

function decodeBase64() {
    const input = document.getElementById('base64Input').value;
    if (!input) {
        showToast('Please enter Base64 string to decode!', 'warning');
        return;
    }
    
    try {
        const decoded = decodeURIComponent(escape(atob(input)));
        document.getElementById('base64Output').textContent = decoded;
        showToast('Decoded from Base64!');
    } catch (e) {
        showToast('Invalid Base64 string!', 'error');
    }
}

function copyResult() {
    const result = document.getElementById('base64Output').textContent;
    if (result) {
        copyToClipboard(result);
    } else {
        showToast('No result to copy!', 'warning');
    }
}

function clearAll() {
    document.getElementById('base64Input').value = '';
    document.getElementById('base64Output').textContent = '';
}
