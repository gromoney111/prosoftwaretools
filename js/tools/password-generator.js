// Password Generator Tool
function generatePassword() {
    const length = document.getElementById('passwordLength').value;
    const useUppercase = document.getElementById('uppercase').checked;
    const useLowercase = document.getElementById('lowercase').checked;
    const useNumbers = document.getElementById('numbers').checked;
    const useSymbols = document.getElementById('symbols').checked;
    
    if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
        showToast('Please select at least one character type!', 'error');
        return;
    }
    
    let chars = '';
    if (useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length];
    }
    
    document.getElementById('passwordDisplay').textContent = password;
    updateStrength(password);
    showToast('Password generated!');
}

function updateStrength(password) {
    let strength = 0;
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    fill.className = 'fill';
    
    if (strength <= 1) {
        fill.classList.add('strength-weak');
        text.textContent = 'Weak password';
        text.style.color = '#ef4444';
    } else if (strength <= 2) {
        fill.classList.add('strength-fair');
        text.textContent = 'Fair password';
        text.style.color = '#f59e0b';
    } else if (strength <= 3) {
        fill.classList.add('strength-good');
        text.textContent = 'Good password';
        text.style.color = '#0ea5e9';
    } else {
        fill.classList.add('strength-strong');
        text.textContent = 'Strong password';
        text.style.color = '#10b981';
    }
}

function updateLength() {
    const val = document.getElementById('passwordLength').value;
    document.getElementById('lengthValue').textContent = val;
}

function copyPassword() {
    const password = document.getElementById('passwordDisplay').textContent;
    if (password && password !== 'Click Generate to create a password') {
        copyToClipboard(password);
    } else {
        showToast('Generate a password first!', 'warning');
    }
}

// Generate one on page load
document.addEventListener('DOMContentLoaded', generatePassword);
