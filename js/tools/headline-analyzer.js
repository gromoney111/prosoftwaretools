// Headline Analyzer Tool
const headlineInput = document.getElementById('headlineInput');

// Real-time analysis
headlineInput.addEventListener('input', function() {
    if (this.value.trim()) {
        analyzeHeadline();
    }
});

const powerWords = ['free', 'ultimate', 'proven', 'secret', 'exclusive', 'guaranteed', 'powerful', 'instant', 'best', 'top', 'new', 'easy', 'simple', 'fast', 'quick', 'effective', 'complete', 'essential', 'premium', 'limited', 'bonus', 'hack', 'tricks', 'guide', 'master', 'boost', 'skyrocket', 'explode', 'unleash', 'dominate', 'crush'];

const emotionalWords = ['amazing', 'incredible', 'unbelievable', 'stunning', 'beautiful', 'brilliant', 'awesome', 'wonderful', 'fantastic', 'remarkable', 'extraordinary', 'surprising', 'shocking', 'terrifying', 'heartbreaking', 'inspiring', 'thrilling', 'hilarious', 'devastating', 'mind-blowing', 'life-changing', 'breathtaking', 'jaw-dropping', 'epic', 'legendary'];

const commonWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'about', 'that', 'this', 'it', 'and', 'or', 'but', 'not', 'your', 'you', 'how', 'what', 'why', 'when', 'where', 'who', 'which'];

function analyzeHeadline() {
    const headline = headlineInput.value.trim();
    if (!headline) {
        showToast('Please enter a headline to analyze', 'warning');
        return;
    }

    const resultBox = document.getElementById('resultBox');
    resultBox.style.display = 'block';

    const words = headline.split(/\s+/);
    const wordCount = words.length;
    const charCount = headline.length;

    // Score calculation
    let score = 0;
    let suggestions = [];

    // Word count scoring (ideal: 6-12 words)
    if (wordCount >= 6 && wordCount <= 12) {
        score += 25;
    } else if (wordCount >= 4 && wordCount <= 14) {
        score += 15;
        if (wordCount < 6) suggestions.push('Try adding a few more words (ideal: 6-12 words)');
        if (wordCount > 12) suggestions.push('Consider shortening your headline (ideal: 6-12 words)');
    } else {
        score += 5;
        if (wordCount < 4) suggestions.push('Your headline is too short. Aim for 6-12 words.');
        if (wordCount > 14) suggestions.push('Your headline is too long. Keep it under 12 words.');
    }

    // Character length scoring (ideal: 50-60 chars)
    if (charCount >= 50 && charCount <= 60) {
        score += 20;
    } else if (charCount >= 40 && charCount <= 70) {
        score += 12;
        if (charCount < 50) suggestions.push('Add more characters for better SEO (ideal: 50-60 chars)');
        if (charCount > 60) suggestions.push('Consider trimming for search display (ideal: 50-60 chars)');
    } else {
        score += 5;
        if (charCount < 40) suggestions.push('Headline is too short for search engines.');
        if (charCount > 70) suggestions.push('Headline may get truncated in search results.');
    }

    // Power words scoring
    const foundPower = words.filter(w => powerWords.includes(w.toLowerCase().replace(/[^a-z]/g, '')));
    if (foundPower.length >= 2) {
        score += 20;
    } else if (foundPower.length === 1) {
        score += 12;
        suggestions.push('Add more power words (e.g., proven, ultimate, free, secret)');
    } else {
        score += 0;
        suggestions.push('Include power words to make your headline more compelling');
    }

    // Emotional words scoring
    const foundEmotional = words.filter(w => emotionalWords.includes(w.toLowerCase().replace(/[^a-z]/g, '')));
    if (foundEmotional.length >= 1) {
        score += 15;
    } else {
        score += 0;
        suggestions.push('Add emotional words to trigger reader curiosity');
    }

    // Number presence
    const hasNumber = /\d/.test(headline);
    if (hasNumber) {
        score += 10;
    } else {
        suggestions.push('Headlines with numbers get 36% more clicks (e.g., "7 Ways to...")');
    }

    // Question format
    const isQuestion = /\?$/.test(headline.trim());
    if (isQuestion) {
        score += 10;
    }

    // Cap score at 100
    score = Math.min(score, 100);

    // Update display
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('wordCountStat').textContent = wordCount;
    document.getElementById('charCountStat').textContent = charCount;

    // Score color and label
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreLabel = document.getElementById('scoreLabel');

    if (score >= 70) {
        scoreCircle.style.borderColor = '#10b981';
        scoreLabel.textContent = 'Great headline!';
        scoreLabel.style.color = '#10b981';
    } else if (score >= 40) {
        scoreCircle.style.borderColor = '#f59e0b';
        scoreLabel.textContent = 'Good, but can be improved';
        scoreLabel.style.color = '#f59e0b';
    } else {
        scoreCircle.style.borderColor = '#ef4444';
        scoreLabel.textContent = 'Needs improvement';
        scoreLabel.style.color = '#ef4444';
    }

    // Word balance analysis
    const commonCount = words.filter(w => commonWords.includes(w.toLowerCase())).length;
    const powerCount = foundPower.length;
    const emotionalCount = foundEmotional.length;
    const uncommonCount = wordCount - commonCount - powerCount - emotionalCount;

    const balanceHtml = '<h4 style="margin-bottom:10px;">Word Balance</h4>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
        '<span style="background:#e0f2fe;padding:5px 12px;border-radius:20px;font-size:0.8rem;">Common: ' + commonCount + '</span>' +
        '<span style="background:#fef3c7;padding:5px 12px;border-radius:20px;font-size:0.8rem;">Uncommon: ' + Math.max(0, uncommonCount) + '</span>' +
        '<span style="background:#fce7f3;padding:5px 12px;border-radius:20px;font-size:0.8rem;">Emotional: ' + emotionalCount + '</span>' +
        '<span style="background:#d1fae5;padding:5px 12px;border-radius:20px;font-size:0.8rem;">Power: ' + powerCount + '</span>' +
        '</div>';
    document.getElementById('wordBalance').innerHTML = balanceHtml;

    // Suggestions
    let suggestionsHtml = '';
    if (suggestions.length > 0) {
        suggestionsHtml = '<h4 style="margin-bottom:10px;">Suggestions</h4><ul style="list-style:none;padding:0;">';
        suggestions.forEach(s => {
            suggestionsHtml += '<li style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:0.9rem;"><i class="fas fa-lightbulb" style="color:#f59e0b;margin-right:8px;"></i>' + s + '</li>';
        });
        suggestionsHtml += '</ul>';
    } else {
        suggestionsHtml = '<p style="color:#10b981;font-weight:600;"><i class="fas fa-check-circle"></i> Your headline is well-optimized!</p>';
    }
    document.getElementById('suggestions').innerHTML = suggestionsHtml;
}

function clearHeadline() {
    headlineInput.value = '';
    document.getElementById('resultBox').style.display = 'none';
}
