// Word Counter Tool
const textInput = document.getElementById('textInput');

// Real-time counting
textInput.addEventListener('input', countWords);

function countWords() {
    const text = textInput.value;
    
    // Word count
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    document.getElementById('wordCount').textContent = words;
    
    // Character count (with spaces)
    document.getElementById('charCount').textContent = text.length;
    
    // Character count (without spaces)
    document.getElementById('charNoSpace').textContent = text.replace(/\s/g, '').length;
    
    // Sentence count
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    document.getElementById('sentenceCount').textContent = sentences;
    
    // Paragraph count
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    document.getElementById('paraCount').textContent = paragraphs;
    
    // Reading time (avg 200 words per minute)
    const minutes = Math.ceil(words / 200);
    document.getElementById('readTime').textContent = minutes + ' min';
}

function clearText() {
    textInput.value = '';
    countWords();
}

function copyText() {
    const text = textInput.value;
    if (text) {
        copyToClipboard(text);
    } else {
        showToast('Nothing to copy!', 'warning');
    }
}
