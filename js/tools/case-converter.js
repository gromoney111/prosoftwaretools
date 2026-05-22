// Case Converter Tool
function convertCase(type) {
    const text = document.getElementById('textInput').value;
    if (!text) {
        showToast('Please enter some text first!', 'warning');
        return;
    }
    
    let result = '';
    
    switch(type) {
        case 'upper':
            result = text.toUpperCase();
            break;
        case 'lower':
            result = text.toLowerCase();
            break;
        case 'title':
            result = text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
            break;
        case 'sentence':
            result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
            break;
        case 'toggle':
            result = text.split('').map(c => {
                return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
            }).join('');
            break;
        default:
            result = text;
    }
    
    document.getElementById('result').textContent = result;
}

function clearText() {
    document.getElementById('textInput').value = '';
    document.getElementById('result').textContent = '';
}

function copyResult() {
    const result = document.getElementById('result').textContent;
    if (result) {
        copyToClipboard(result);
    } else {
        showToast('No result to copy!', 'warning');
    }
}
