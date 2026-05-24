// URL Shortener Tool - Creates REAL working short URLs via is.gd API
const BRAND_PREFIX = 'prosoftware/';

async function shortenURL() {
    const longUrl = document.getElementById('longUrl').value.trim();
    let customName = document.getElementById('customName').value.trim();
    
    if (!longUrl) {
        showToast('Please enter a URL!', 'warning');
        return;
    }
    
    if (!isValidURL(longUrl)) {
        showToast('Please enter a valid URL (must start with https://)', 'error');
        return;
    }
    
    // Sanitize custom name
    if (customName) {
        customName = customName.replace(/[^a-zA-Z0-9-_]/g, '');
        if (customName.length < 5) {
            showToast('Custom name must be at least 5 characters!', 'warning');
            return;
        }
    }
    
    // Show loading state
    const btn = document.querySelector('.btn-primary[onclick="shortenURL()"]');
    const originalBtnText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    btn.disabled = true;
    
    try {
        // Call is.gd API to create real working short URL
        let apiUrl = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(longUrl)}`;
        if (customName) {
            apiUrl += `&shorturl=${encodeURIComponent(customName)}`;
        }
        
        const response = await fetch(apiUrl);
        const shortUrl = await response.text();
        
        if (shortUrl.startsWith('Error') || !shortUrl.startsWith('http')) {
            // Custom name might be taken, try without it
            if (customName) {
                showToast('Custom name unavailable, generating random...', 'warning');
                const fallbackResponse = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(longUrl)}`);
                const fallbackUrl = await fallbackResponse.text();
                if (fallbackUrl.startsWith('http')) {
                    displayResult(fallbackUrl, longUrl, customName);
                } else {
                    throw new Error(fallbackUrl);
                }
            } else {
                throw new Error(shortUrl);
            }
        } else {
            displayResult(shortUrl, longUrl, customName);
        }
    } catch (e) {
        showToast('Error: ' + e.message, 'error');
    } finally {
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
    }
}

function displayResult(realShortUrl, longUrl, customName) {
    // Extract the short code from the real URL (e.g., "myname" from "https://is.gd/myname")
    const shortCode = realShortUrl.replace(/https?:\/\/[^\/]+\//, '');
    const brandedDisplay = BRAND_PREFIX + shortCode;
    
    // Save to localStorage
    const links = JSON.parse(localStorage.getItem('shortLinks') || '{}');
    links[shortCode] = { real: realShortUrl, long: longUrl, branded: brandedDisplay, created: Date.now() };
    localStorage.setItem('shortLinks', JSON.stringify(links));
    
    // Display
    document.getElementById('brandedUrlResult').textContent = brandedDisplay;
    document.getElementById('realUrlResult').textContent = realShortUrl;
    document.getElementById('originalUrlDisplay').textContent = longUrl;
    document.getElementById('resultBox').style.display = 'block';
    
    loadLinkHistory();
    showToast('Short URL created and works!');
}

function isValidURL(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

function copyBrandedUrl() {
    const url = document.getElementById('brandedUrlResult').textContent;
    if (url) copyToClipboard(url);
}

function copyRealUrl() {
    const url = document.getElementById('realUrlResult').textContent;
    if (url) copyToClipboard(url);
}

function loadLinkHistory() {
    const links = JSON.parse(localStorage.getItem('shortLinks') || '{}');
    const historyList = document.getElementById('linkHistory');
    
    if (Object.keys(links).length === 0) {
        historyList.innerHTML = '<p style="color:var(--gray); text-align:center; padding:20px;">No links created yet</p>';
        return;
    }
    
    const sorted = Object.entries(links).sort((a, b) => (b[1].created || 0) - (a[1].created || 0));
    
    historyList.innerHTML = sorted.map(([code, data]) => {
        // Handle old format
        const realUrl = data.real || data;
        const longUrl = data.long || '';
        const branded = data.branded || (BRAND_PREFIX + code);
        
        return `
        <div style="background:white; padding:14px; border-radius:8px; border:1px solid var(--border); margin-bottom:10px;">
            <div style="font-weight:700; color:var(--primary); font-size:0.95rem; word-break:break-all; margin-bottom:4px;">
                ${branded}
            </div>
            <div style="font-size:0.8rem; color:var(--success); word-break:break-all; margin-bottom:4px;">
                <i class="fas fa-link"></i> Working URL: <a href="${realUrl}" target="_blank" style="color:var(--success); text-decoration:underline;">${realUrl}</a>
            </div>
            ${longUrl ? `<div style="font-size:0.75rem; color:var(--gray); word-break:break-all; margin-bottom:8px;">→ ${longUrl}</div>` : ''}
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button class="btn-secondary" style="padding:5px 10px; font-size:0.75rem;" onclick="copyToClipboard('${branded}')">
                    <i class="fas fa-copy"></i> Copy Branded
                </button>
                <button class="btn-secondary" style="padding:5px 10px; font-size:0.75rem;" onclick="copyToClipboard('${realUrl}')">
                    <i class="fas fa-copy"></i> Copy Real URL
                </button>
                <button class="btn-secondary" style="padding:5px 10px; font-size:0.75rem;" onclick="deleteLink('${code}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;}).join('');
}

function deleteLink(code) {
    const links = JSON.parse(localStorage.getItem('shortLinks') || '{}');
    delete links[code];
    localStorage.setItem('shortLinks', JSON.stringify(links));
    loadLinkHistory();
    showToast('Link deleted!');
}

function clearAllLinks() {
    if (confirm('Delete all short links from history? (The actual short URLs will still work)')) {
        localStorage.removeItem('shortLinks');
        loadLinkHistory();
        showToast('History cleared!');
    }
}

document.addEventListener('DOMContentLoaded', loadLinkHistory);
