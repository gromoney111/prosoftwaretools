// Resume Maker Tool
function generateResume() {
    const data = {
        name: document.getElementById('rmName').value || 'Your Name',
        title: document.getElementById('rmTitle').value || 'Professional Title',
        email: document.getElementById('rmEmail').value || 'email@example.com',
        phone: document.getElementById('rmPhone').value || '+1 (000) 000-0000',
        location: document.getElementById('rmLocation').value || 'City, State',
        linkedin: document.getElementById('rmLinkedin').value || '',
        summary: document.getElementById('rmSummary').value || 'Professional summary goes here...',
        experience: document.getElementById('rmExperience').value || '',
        education: document.getElementById('rmEducation').value || '',
        skills: document.getElementById('rmSkills').value || ''
    };
    
    const resume = `
<div style="font-family: 'Inter', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white; color: #1e293b;">
    <header style="border-bottom: 3px solid #4f46e5; padding-bottom: 20px; margin-bottom: 24px;">
        <h1 style="font-size: 2.2rem; margin: 0; color: #1e293b;">${data.name}</h1>
        <h2 style="font-size: 1.2rem; color: #4f46e5; font-weight: 500; margin: 4px 0 12px;">${data.title}</h2>
        <div style="font-size: 0.9rem; color: #64748b;">
            <span><i class="fas fa-envelope"></i> ${data.email}</span> | 
            <span><i class="fas fa-phone"></i> ${data.phone}</span> | 
            <span><i class="fas fa-map-marker-alt"></i> ${data.location}</span>
            ${data.linkedin ? ` | <span><i class="fab fa-linkedin"></i> ${data.linkedin}</span>` : ''}
        </div>
    </header>
    
    <section style="margin-bottom: 20px;">
        <h3 style="color: #4f46e5; font-size: 1.1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px;">PROFESSIONAL SUMMARY</h3>
        <p style="line-height: 1.6; font-size: 0.95rem;">${data.summary}</p>
    </section>
    
    ${data.experience ? `
    <section style="margin-bottom: 20px;">
        <h3 style="color: #4f46e5; font-size: 1.1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px;">WORK EXPERIENCE</h3>
        <div style="white-space: pre-line; line-height: 1.6; font-size: 0.95rem;">${data.experience}</div>
    </section>
    ` : ''}
    
    ${data.education ? `
    <section style="margin-bottom: 20px;">
        <h3 style="color: #4f46e5; font-size: 1.1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px;">EDUCATION</h3>
        <div style="white-space: pre-line; line-height: 1.6; font-size: 0.95rem;">${data.education}</div>
    </section>
    ` : ''}
    
    ${data.skills ? `
    <section style="margin-bottom: 20px;">
        <h3 style="color: #4f46e5; font-size: 1.1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px;">SKILLS</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${data.skills.split(',').map(s => `<span style="background: rgba(79,70,229,0.08); color: #4f46e5; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 500;">${s.trim()}</span>`).join('')}
        </div>
    </section>
    ` : ''}
</div>`;
    
    document.getElementById('rmPreview').innerHTML = resume;
    document.getElementById('rmResult').style.display = 'block';
    showToast('Resume generated!');
}

function printResume() {
    const html = document.getElementById('rmPreview').innerHTML;
    if (!html) {
        showToast('Generate resume first!', 'warning');
        return;
    }
    const win = window.open('', '_blank');
    win.document.write(`
        <html>
        <head>
            <title>Resume</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>body { margin:0; } @media print { body { margin:0; } }</style>
        </head>
        <body>${html}</body>
        </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 500);
}

function downloadResume() {
    const html = document.getElementById('rmPreview').innerHTML;
    if (!html) {
        showToast('Generate resume first!', 'warning');
        return;
    }
    const fullHtml = `<!DOCTYPE html><html><head><title>Resume</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></head><body>${html}</body></html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const link = document.createElement('a');
    link.download = 'resume.html';
    link.href = URL.createObjectURL(blob);
    link.click();
    showToast('Resume downloaded! Open in browser & print to PDF.');
}
