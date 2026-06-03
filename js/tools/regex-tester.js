// Regex Tester Tool
const regexPattern = document.getElementById('regexPattern');
const testString = document.getElementById('testString');
const flagG = document.getElementById('flagG');
const flagI = document.getElementById('flagI');
const flagM = document.getElementById('flagM');

// Real-time testing
regexPattern.addEventListener('input', testRegex);
testString.addEventListener('input', testRegex);
flagG.addEventListener('change', testRegex);
flagI.addEventListener('change', testRegex);
flagM.addEventListener('change', testRegex);

function testRegex() {
    const pattern = regexPattern.value;
    const text = testString.value;
    const resultBox = document.getElementById('resultBox');
    const highlightedResult = document.getElementById('highlightedResult');
    const captureGroups = document.getElementById('captureGroups');
    const groupsList = document.getElementById('groupsList');

    if (!pattern || !text) {
        resultBox.style.display = 'none';
        return;
    }

    // Build flags
    let flags = '';
    if (flagG.checked) flags += 'g';
    if (flagI.checked) flags += 'i';
    if (flagM.checked) flags += 'm';

    try {
        const regex = new RegExp(pattern, flags);
        const matches = [];
        let match;
        let matchCount = 0;

        if (flags.includes('g')) {
            while ((match = regex.exec(text)) !== null) {
                matches.push({ index: match.index, length: match[0].length, groups: match.slice(1), full: match[0] });
                matchCount++;
                if (matchCount > 1000) break; // Safety limit
            }
        } else {
            match = regex.exec(text);
            if (match) {
                matches.push({ index: match.index, length: match[0].length, groups: match.slice(1), full: match[0] });
                matchCount = 1;
            }
        }

        resultBox.style.display = 'block';
        document.getElementById('matchCount').textContent = matchCount;

        // Highlight matches in the text
        if (matchCount > 0) {
            let highlighted = '';
            let lastIndex = 0;
            matches.forEach(m => {
                highlighted += escapeHtml(text.substring(lastIndex, m.index));
                highlighted += '<span style="background:#667eea;color:white;padding:1px 3px;border-radius:3px;">' + escapeHtml(text.substring(m.index, m.index + m.length)) + '</span>';
                lastIndex = m.index + m.length;
            });
            highlighted += escapeHtml(text.substring(lastIndex));
            highlightedResult.innerHTML = highlighted;
        } else {
            highlightedResult.innerHTML = '<span style="color:#888;">No matches found</span>';
        }

        // Show capture groups
        const hasGroups = matches.some(m => m.groups.length > 0);
        if (hasGroups) {
            captureGroups.style.display = 'block';
            let groupsHtml = '';
            matches.forEach((m, i) => {
                if (m.groups.length > 0) {
                    groupsHtml += '<div style="margin-bottom:8px;"><strong>Match ' + (i + 1) + ':</strong> "' + escapeHtml(m.full) + '"<br>';
                    m.groups.forEach((g, gi) => {
                        groupsHtml += '&nbsp;&nbsp;Group ' + (gi + 1) + ': "' + escapeHtml(g || '') + '"<br>';
                    });
                    groupsHtml += '</div>';
                }
            });
            groupsList.innerHTML = groupsHtml;
        } else {
            captureGroups.style.display = 'none';
        }
    } catch (e) {
        resultBox.style.display = 'block';
        document.getElementById('matchCount').textContent = '0';
        highlightedResult.innerHTML = '<span style="color:#ef4444;">Error: ' + escapeHtml(e.message) + '</span>';
        captureGroups.style.display = 'none';
    }
}

function clearAll() {
    regexPattern.value = '';
    testString.value = '';
    document.getElementById('resultBox').style.display = 'none';
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
