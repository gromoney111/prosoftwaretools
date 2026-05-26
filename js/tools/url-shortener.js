// URL Shortener - Creates REAL working short URLs using your own site
const BRAND_PREFIX = 'prosoftware/';

function getSiteBase() {
    // Use current origin + path to handle GitHub Pages, custom domain, etc.
    const path = window.location.pathname.replace(/tools\/url-shortener\.html.*$/, '');
    return window.location.origin + path;
}

function shortenURL() {
    const longUrl = document.getElementById('longUrl').value.trim();
    let customName = document.getElementById('customName').value.trim();
    
    if (!longUrl) {
        showToast('Please enter a URL!', 'warning');
        return;
    }
    
    if (!isValidURL(longUrl)) {
        showToast('Please enter a valid URL (must start with https:// or http://)', 'error');
        return;
    }
    
    // Generate or sanitize custom name
    if (!customName) {
        customName = generateRandomString(6);
    } else {
        customName = customName.replace(/[^a-zA-Z0-9-_]/g, '');
        if (customName.length < 3) {
            showToast('Custom name must be at least 3 characters!', 'warning');
            return;
        }
    }
    
    // Save mapping to localStorage
    const links = JSON.parse(localStorage.getItem('shortLinks') || '{}');
    
    if (links[customName] && (typeof links[customName] === 'object' ? links[customName].long : links[customName]) !== longUrl) {
        if (!confirm('"' + customName + '" already exists. Overwrite it?')) {
            return;
        }
    }
    
    links[customName] = { long: longUrl, created: Date.now() };
    localStorage.setItem('shortLinks', JSON.stringify(links));
    
    // Build URLs
    const realWorkingUrl = getSiteBase() + '?go=' + encodeURIComponent(customName);
    const brandedDisplay = BRAND_PREFIX + customName;
    
    // Display
    document.getElementById('brandedUrlResult').textContent = brandedDisplay;
    const realLink = document.getElementById('realUrlResult');
    realLink.textContent = realWorkingUrl;
    realLink.href = realWorkingUrl;
    document.getElementById('originalUrlDisplay').textContent = longUrl;
    document.getElementById('resultBox').style.display = 'block';
    
    loadLinkHistory();
    showToast('Short URL created! Click "Working URL" to test.');
}

function isValidURL(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
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
    if (!historyList) return;
    
    if (Object.keys(links).length === 0) {
        historyList.innerHTML = '<p style="color:var(--gray); text-align:center; padding:20px;">No links created yet</p>';
        return;
    }
    
    const sorted = Object.entries(links).sort((a, b) => {
        const aTime = (typeof a[1] === 'object' && a[1].created) ? a[1].created : 0;
        const bTime = (typeof b[1] === 'object' && b[1].created) ? b[1].created : 0;
        return bTime - aTime;
    });
    
    historyList.innerHTML = sorted.map(([name, data]) => {
        const longUrl = (typeof data === 'object') ? data.long : data;
        const realUrl = getSiteBase() + '?go=' + encodeURIComponent(name);
        const branded = BRAND_PREFIX + name;
        
        return '<div style="background:white; padding:14px; border-radius:8px; border:1px solid var(--border); margin-bottom:10px;">'
            + '<div style="font-weight:700; color:var(--primary); font-size:1rem; margin-bottom:6px;">' + branded + '</div>'
            + '<div style="font-size:0.8rem; margin-bottom:4px;"><a href="' + realUrl + '" target="_blank" style="color:var(--success); text-decoration:underline; word-break:break-all;"><i class="fas fa-link"></i> ' + realUrl + '</a></div>'
            + '<div style="font-size:0.75rem; color:var(--gray); word-break:break-all; margin-bottom:8px;">&rarr; ' + longUrl + '</div>'
            + '<div style="display:flex; gap:6px; flex-wrap:wrap;">'
            + '<button class="btn-secondary" style="padding:5px 10px; font-size:0.75rem;" onclick="copyToClipboard(\'' + branded + '\')"><i class="fas fa-copy"></i> Branded</button>'
            + '<button class="btn-secondary" style="padding:5px 10px; font-size:0.75rem;" onclick="copyToClipboard(\'' + realUrl + '\')"><i class="fas fa-copy"></i> Working URL</button>'
            + '<button class="btn-secondary" style="padding:5px 10px; font-size:0.75rem;" onclick="deleteLink(\'' + name + '\')"><i class="fas fa-trash"></i></button>'
            + '</div></div>';
    }).join('');
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
