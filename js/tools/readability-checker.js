// Readability Checker Tool
const contentInput = document.getElementById('contentInput');

// Real-time analysis
contentInput.addEventListener('input', function() {
    if (this.value.trim().split(/\s+/).length >= 10) {
        checkReadability();
    }
});

function checkReadability() {
    const text = contentInput.value.trim();
    if (!text) {
        showToast('Please enter some content to analyze', 'warning');
        return;
    }

    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    if (wordCount < 5) {
        showToast('Please enter at least a few sentences for accurate analysis', 'warning');
        return;
    }

    const resultBox = document.getElementById('resultBox');
    resultBox.style.display = 'block';

    // Count sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;

    // Count paragraphs
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    const paragraphCount = paragraphs.length;

    // Count syllables
    let totalSyllables = 0;
    words.forEach(word => {
        totalSyllables += countSyllables(word);
    });

    // Average words per sentence
    const avgWordsPerSentence = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : 0;

    // Average syllables per word
    const avgSyllablesPerWord = wordCount > 0 ? (totalSyllables / wordCount).toFixed(2) : 0;

    // Flesch Reading Ease Score
    // Formula: 206.835 - 1.015(total words/total sentences) - 84.6(total syllables/total words)
    const fleschScore = Math.max(0, Math.min(100,
        206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (totalSyllables / wordCount))
    ));
    const roundedFlesch = Math.round(fleschScore * 10) / 10;

    // Flesch-Kincaid Grade Level
    // Formula: 0.39(total words/total sentences) + 11.8(total syllables/total words) - 15.59
    const gradeLevel = Math.max(0,
        (0.39 * (wordCount / sentenceCount)) + (11.8 * (totalSyllables / wordCount)) - 15.59
    );
    const roundedGrade = Math.round(gradeLevel * 10) / 10;

    // Reading time (200 words per minute)
    const readingMinutes = Math.ceil(wordCount / 200);

    // Update display
    document.getElementById('readScoreValue').textContent = roundedFlesch;
    document.getElementById('gradeLevel').textContent = roundedGrade;
    document.getElementById('totalWords').textContent = wordCount;
    document.getElementById('totalSentences').textContent = sentenceCount;
    document.getElementById('totalParagraphs').textContent = paragraphCount;
    document.getElementById('avgWordsPerSentence').textContent = avgWordsPerSentence;
    document.getElementById('avgSyllables').textContent = avgSyllablesPerWord;
    document.getElementById('readingTime').textContent = readingMinutes + ' min';

    // Score color
    const scoreCircle = document.getElementById('readScoreCircle');
    const gradeInterpretation = document.getElementById('gradeInterpretation');

    if (fleschScore >= 60) {
        scoreCircle.style.borderColor = '#10b981';
    } else if (fleschScore >= 30) {
        scoreCircle.style.borderColor = '#f59e0b';
    } else {
        scoreCircle.style.borderColor = '#ef4444';
    }

    // Grade interpretation
    let interpretation = '';
    if (roundedGrade <= 5) interpretation = '5th grade or below - Very easy to read';
    else if (roundedGrade <= 6) interpretation = '6th grade - Easy to read';
    else if (roundedGrade <= 7) interpretation = '7th grade - Fairly easy to read';
    else if (roundedGrade <= 8) interpretation = '8th grade - Standard reading level';
    else if (roundedGrade <= 10) interpretation = '9th-10th grade - Slightly difficult';
    else if (roundedGrade <= 12) interpretation = '11th-12th grade - Difficult';
    else interpretation = 'College level - Very difficult';

    gradeInterpretation.textContent = interpretation;

    // SEO recommendation
    const seoBox = document.getElementById('seoRecommendation');
    if (roundedGrade >= 7 && roundedGrade <= 8) {
        seoBox.style.background = '#d1fae5';
        seoBox.style.color = '#065f46';
        seoBox.innerHTML = '<i class="fas fa-check-circle"></i> <strong>Great for SEO!</strong> Your content is at the ideal grade level (7-8) for web content. Most online readers prefer this readability level.';
    } else if (roundedGrade < 7) {
        seoBox.style.background = '#e0f2fe';
        seoBox.style.color = '#0c4a6e';
        seoBox.innerHTML = '<i class="fas fa-info-circle"></i> <strong>Very readable.</strong> Your content is easy to read. This works well for broad audiences. For more authoritative content, you could add slightly more complex sentences.';
    } else {
        seoBox.style.background = '#fef3c7';
        seoBox.style.color = '#92400e';
        seoBox.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <strong>Consider simplifying.</strong> For web content, aim for grade 7-8 readability. Try shorter sentences, simpler words, and break up long paragraphs.';
    }
}

function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');

    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
}

function clearContent() {
    contentInput.value = '';
    document.getElementById('resultBox').style.display = 'none';
}
