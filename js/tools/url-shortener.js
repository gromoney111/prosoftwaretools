// URL Shortener Tool with Custom Branded URLs
const BASE_URL = 'https://prosoftwaretools.com/';

function shortenURL() {
    const longUrl = document.getElementById('longUrl').value.trim();
    let customName = document.getElementById('customName').value.trim();
    
    if (!longUrl) {
        showToast('Please enter a URL!', 'warning');
        return;
    }
    
    if (!isValidURL(longUrl)) {
        showToast('Please enter a valid URL (https://...)', 'error');
        return;
    }
    
    // Generate random name if not provided
    if (!customName) {
        customName = generateRandomString(6);
    } else {
        // Sanitize custom name
        customName = customName.replace(/[^a-zA-Z0-9-_]/g, '');
        if (customName.length < 3) {
            showToast('Custom name must be at least 3 characters!', 'warning');
            return;
        }
    }
    
    // Save to localStorage
    const links = JSON.parse(localStorage.getItem('shortLinks') || '{}');
    
    if (links[customName] && links[customName] !== longUrl) {
        showToast('This name is already taken! Try another.', 'error');
        return;
    }
    
    links[customName] = longUrl;
    localStorage.setItem('shortLinks', JSON.stringify(links));
    
    const shortUrl = BASE_URL + customName;
    document.getElementById('shortUrlResult').textContent = shortUrl;
    document.getElementById('originalUrlDisplay').textContent = longUrl;
    document.getElementById('resultBox').style.display = 'block';
    
    loadLinkHistory();
    showToast('Short URL created!');
}

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function copyShortUrl() {
    const url = document.getElementById('shortUrlResult').textContent;
    if (url) copyToClipboard(url);
}

function loadLinkHistory() {
    const links = JSON.parse(localStorage.getItem('shortLinks') || '{}');
    const historyList = document.getElementById('linkHistory');
    
    if (Object.keys(links).length === 0) {
        historyList.innerHTML = '<p style="color:var(--gray); text-align:center;">No links created yet</p>';
        return;
    }
    
    historyList.innerHTML = Object.entries(links).reverse().map(([name, url]) => `
        <div style="background:var(--white); padding:12px; border-radius:8px; border:1px solid var(--border); margin-bottom:8px;">
            <div style="font-weight:600; color:var(--primary); font-size:0.9rem; word-break:break-all;">
                ${BASE_URL}${name}
            </div>
            <div style="font-size:0.8rem; color:var(--gray); margin-top:4px; word-break:break-all;">
                → ${url}
            </div>
            <div style="margin-top:8px;">
                <button class="btn-secondary" style="padding:6px 12px; font-size:0.8rem;" onclick="copyToClipboard('${BASE_URL}${name}')">
                    <i class="fas fa-copy"></i> Copy
                </button>
                <button class="btn-secondary" style="padding:6px 12px; font-size:0.8rem;" onclick="deleteLink('${name}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function deleteLink(name) {
    const links = JSON.parse(localStorage.getItem('shortLinks') || '{}');
    delete links[name];
    localStorage.setItem('shortLinks', JSON.stringify(links));
    loadLinkHistory();
    showToast('Link deleted!');
}

function clearAllLinks() {
    if (confirm('Delete all short links?')) {
        localStorage.removeItem('shortLinks');
        loadLinkHistory();
        showToast('All links cleared!');
    }
}

document.addEventListener('DOMContentLoaded', loadLinkHistory);
