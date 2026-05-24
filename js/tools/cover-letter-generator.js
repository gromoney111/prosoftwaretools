// Cover Letter Generator
function generateCoverLetter() {
    const yourName = document.getElementById('clYourName').value.trim() || '[Your Name]';
    const yourEmail = document.getElementById('clYourEmail').value.trim() || '[Your Email]';
    const yourPhone = document.getElementById('clYourPhone').value.trim() || '[Your Phone]';
    const company = document.getElementById('clCompany').value.trim() || '[Company Name]';
    const hiringManager = document.getElementById('clHiringManager').value.trim() || 'Hiring Manager';
    const position = document.getElementById('clPosition').value.trim() || '[Position]';
    const experience = document.getElementById('clExperience').value.trim() || '5+ years of experience';
    const skills = document.getElementById('clSkills').value.trim() || 'relevant skills';
    const why = document.getElementById('clWhy').value.trim() || 'I am excited about this opportunity';
    const tone = document.getElementById('clTone').value;
    
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    let opening, body, closing;
    
    if (tone === 'professional') {
        opening = `Dear ${hiringManager},\n\nI am writing to express my strong interest in the ${position} position at ${company}. With ${experience}, I am confident that I would be a valuable addition to your team.`;
        body = `Throughout my career, I have developed expertise in ${skills}. ${why} ${company} is renowned for its excellence, and I would be honored to contribute to your continued success.\n\nIn my previous roles, I have demonstrated the ability to deliver results, collaborate effectively with cross-functional teams, and adapt to evolving challenges. My commitment to professional growth and excellence aligns well with the values of ${company}.`;
        closing = `Thank you for considering my application. I have attached my resume for your review and would welcome the opportunity to discuss how my background and skills align with your needs. I look forward to hearing from you.\n\nSincerely,\n${yourName}`;
    } else if (tone === 'enthusiastic') {
        opening = `Dear ${hiringManager},\n\nI was thrilled to discover the ${position} opening at ${company}! With ${experience} and a genuine passion for this field, I'm excited to throw my hat in the ring.`;
        body = `My background in ${skills} has prepared me well for this role. ${why} What truly excites me about ${company} is your innovative approach and commitment to making an impact.\n\nI thrive in dynamic environments and love bringing fresh ideas to the table. The opportunity to contribute to ${company}'s mission would be a dream come true, and I'm confident I'd hit the ground running.`;
        closing = `I'd love the chance to discuss how my enthusiasm and skills can benefit ${company}. Thank you for considering my application - I can't wait to hear from you!\n\nWarm regards,\n${yourName}`;
    } else { // confident
        opening = `Dear ${hiringManager},\n\nI am applying for the ${position} role at ${company}. With ${experience}, I bring proven expertise and a track record of delivering results that I'm eager to contribute to your team.`;
        body = `My core strengths in ${skills} have enabled me to consistently exceed expectations and drive meaningful outcomes. ${why} I am drawn to ${company} because of your reputation for excellence and innovation in the industry.\n\nI excel at solving complex challenges, leading initiatives, and producing high-quality work under pressure. I am confident that my skills and experience make me an ideal candidate for this position.`;
        closing = `I would welcome the opportunity to discuss how I can contribute to ${company}'s continued growth and success. Please find my resume attached, and I look forward to your response.\n\nBest regards,\n${yourName}`;
    }
    
    const letter = `${yourName}\n${yourEmail} | ${yourPhone}\n\n${today}\n\n${hiringManager}\n${company}\n\n${opening}\n\n${body}\n\n${closing}`;
    
    document.getElementById('clOutput').textContent = letter;
    document.getElementById('clResult').style.display = 'block';
    showToast('Cover letter generated!');
}

function copyCoverLetter() {
    const text = document.getElementById('clOutput').textContent;
    if (text) copyToClipboard(text);
}

function downloadCoverLetter() {
    const text = document.getElementById('clOutput').textContent;
    if (!text) {
        showToast('Generate cover letter first!', 'warning');
        return;
    }
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = 'cover-letter.txt';
    link.href = URL.createObjectURL(blob);
    link.click();
    showToast('Cover letter downloaded!');
}

function printCoverLetter() {
    const text = document.getElementById('clOutput').textContent;
    if (!text) {
        showToast('Generate cover letter first!', 'warning');
        return;
    }
    const win = window.open('', '_blank');
    win.document.write(`<pre style="font-family: Georgia, serif; padding: 40px; line-height: 1.6;">${text}</pre>`);
    win.print();
}
