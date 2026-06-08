// Meta Tag Generator Tool
function generateMetaTags() {
    const title = document.getElementById('mtTitle').value.trim();
    const description = document.getElementById('mtDescription').value.trim();
    const keywords = document.getElementById('mtKeywords').value.trim();
    const author = document.getElementById('mtAuthor').value.trim();
    const url = document.getElementById('mtUrl').value.trim();
    const image = document.getElementById('mtImage').value.trim();
    const robots = document.getElementById('mtRobots').value;
    const ogType = document.getElementById('mtOgType').value;
    const twitterCard = document.getElementById('mtTwitterCard').value;
    const viewport = document.getElementById('mtViewport').checked;
    const charset = document.getElementById('mtCharset').checked;

    if (!title) {
        showToast('Please enter a page title!', 'warning');
        return;
    }

    let tags = '';
    
    if (charset) {
        tags += '<meta charset="UTF-8">\n';
    }
    if (viewport) {
        tags += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    }
    
    tags += '\n<!-- Primary Meta Tags -->\n';
    tags += '<title>' + escapeHtml(title) + '</title>\n';
    
    if (description) {
        tags += '<meta name="description" content="' + escapeHtml(description) + '">\n';
    }
    if (keywords) {
        tags += '<meta name="keywords" content="' + escapeHtml(keywords) + '">\n';
    }
    if (author) {
        tags += '<meta name="author" content="' + escapeHtml(author) + '">\n';
    }
    if (robots) {
        tags += '<meta name="robots" content="' + robots + '">\n';
    }
    if (url) {
        tags += '<link rel="canonical" href="' + escapeHtml(url) + '">\n';
    }

    // Open Graph
    tags += '\n<!-- Open Graph / Facebook -->\n';
    tags += '<meta property="og:type" content="' + ogType + '">\n';
    tags += '<meta property="og:title" content="' + escapeHtml(title) + '">\n';
    if (description) {
        tags += '<meta property="og:description" content="' + escapeHtml(description) + '">\n';
    }
    if (url) {
        tags += '<meta property="og:url" content="' + escapeHtml(url) + '">\n';
    }
    if (image) {
        tags += '<meta property="og:image" content="' + escapeHtml(image) + '">\n';
    }

    // Twitter Card
    tags += '\n<!-- Twitter -->\n';
    tags += '<meta name="twitter:card" content="' + twitterCard + '">\n';
    tags += '<meta name="twitter:title" content="' + escapeHtml(title) + '">\n';
    if (description) {
        tags += '<meta name="twitter:description" content="' + escapeHtml(description) + '">\n';
    }
    if (image) {
        tags += '<meta name="twitter:image" content="' + escapeHtml(image) + '">\n';
    }

    document.getElementById('mtOutput').textContent = tags;
    document.getElementById('mtResult').style.display = 'block';
    
    // Update preview
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewUrl').textContent = url || 'https://yourwebsite.com';
    document.getElementById('previewDesc').textContent = description || 'No description provided';
    document.getElementById('mtPreview').style.display = 'block';
    
    // Character counts
    updateCharCounts();
    showToast('Meta tags generated!');
}

function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function updateCharCounts() {
    const title = document.getElementById('mtTitle').value;
    const desc = document.getElementById('mtDescription').value;
    
    const titleCount = document.getElementById('titleCount');
    const descCount = document.getElementById('descCount');
    
    if (titleCount) {
        titleCount.textContent = title.length + '/60';
        titleCount.style.color = title.length > 60 ? '#ef4444' : title.length > 50 ? '#f59e0b' : '#10b981';
    }
    if (descCount) {
        descCount.textContent = desc.length + '/160';
        descCount.style.color = desc.length > 160 ? '#ef4444' : desc.length > 140 ? '#f59e0b' : '#10b981';
    }
}

function copyMetaTags() {
    const output = document.getElementById('mtOutput').textContent;
    if (output) {
        copyToClipboard(output);
    } else {
        showToast('Generate meta tags first!', 'warning');
    }
}

function clearMetaForm() {
    document.querySelectorAll('#metaForm input[type="text"], #metaForm input[type="url"], #metaForm textarea').forEach(el => el.value = '');
    document.getElementById('mtOutput').textContent = '';
    document.getElementById('mtResult').style.display = 'none';
    document.getElementById('mtPreview').style.display = 'none';
    updateCharCounts();
}

// Real-time character count
document.addEventListener('DOMContentLoaded', function() {
    const titleInput = document.getElementById('mtTitle');
    const descInput = document.getElementById('mtDescription');
    if (titleInput) titleInput.addEventListener('input', updateCharCounts);
    if (descInput) descInput.addEventListener('input', updateCharCounts);
});
