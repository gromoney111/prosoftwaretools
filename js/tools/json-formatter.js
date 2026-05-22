// JSON Formatter Tool
function formatJSON() {
    const input = document.getElementById('jsonInput').value.trim();
    if (!input) {
        showToast('Please enter JSON data!', 'warning');
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 4);
        document.getElementById('jsonOutput').textContent = formatted;
        showValidation(true, 'Valid JSON - Formatted successfully!');
        showToast('JSON formatted!');
    } catch (e) {
        showValidation(false, 'Invalid JSON: ' + e.message);
        showToast('Invalid JSON!', 'error');
    }
}

function minifyJSON() {
    const input = document.getElementById('jsonInput').value.trim();
    if (!input) {
        showToast('Please enter JSON data!', 'warning');
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        document.getElementById('jsonOutput').textContent = minified;
        showValidation(true, 'Valid JSON - Minified successfully!');
        showToast('JSON minified!');
    } catch (e) {
        showValidation(false, 'Invalid JSON: ' + e.message);
        showToast('Invalid JSON!', 'error');
    }
}

function validateJSON() {
    const input = document.getElementById('jsonInput').value.trim();
    if (!input) {
        showToast('Please enter JSON data!', 'warning');
        return;
    }
    
    try {
        JSON.parse(input);
        showValidation(true, 'Valid JSON!');
        showToast('JSON is valid!');
    } catch (e) {
        showValidation(false, 'Invalid JSON: ' + e.message);
        showToast('Invalid JSON!', 'error');
    }
}

function showValidation(isValid, message) {
    const msg = document.getElementById('validationMsg');
    msg.style.display = 'block';
    msg.textContent = message;
    if (isValid) {
        msg.style.background = 'rgba(16, 185, 129, 0.1)';
        msg.style.color = '#10b981';
        msg.style.border = '1px solid #10b981';
    } else {
        msg.style.background = 'rgba(239, 68, 68, 0.1)';
        msg.style.color = '#ef4444';
        msg.style.border = '1px solid #ef4444';
    }
}

function copyResult() {
    const result = document.getElementById('jsonOutput').textContent;
    if (result) {
        copyToClipboard(result);
    } else {
        showToast('No result to copy!', 'warning');
    }
}

function clearAll() {
    document.getElementById('jsonInput').value = '';
    document.getElementById('jsonOutput').textContent = '';
    document.getElementById('validationMsg').style.display = 'none';
}
