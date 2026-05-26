// Business Name Idea Generator
const prefixes = {
    tech: ['Tech', 'Cyber', 'Digital', 'Smart', 'Cloud', 'Quantum', 'Pixel', 'Byte', 'Nexus', 'Logic', 'Neural', 'Data'],
    creative: ['Bold', 'Vibe', 'Spark', 'Pulse', 'Wave', 'Echo', 'Glow', 'Bright', 'Vivid', 'Pure', 'Lush', 'Bloom'],
    business: ['Pro', 'Apex', 'Prime', 'Elite', 'Peak', 'Crown', 'Royal', 'Premier', 'Capital', 'Summit', 'Pinnacle', 'Vista'],
    finance: ['Trust', 'Wealth', 'Capital', 'Prosper', 'Apex', 'Vault', 'Sterling', 'Gold', 'Equity', 'Fortune', 'Asset', 'Reserve'],
    health: ['Vital', 'Pure', 'Wellness', 'Zen', 'Nova', 'Bloom', 'Thrive', 'Glow', 'Lively', 'Fresh', 'Pure', 'Vita'],
    food: ['Tasty', 'Fresh', 'Crisp', 'Savor', 'Zest', 'Bite', 'Flavor', 'Yum', 'Spice', 'Hearth', 'Harvest', 'Crave'],
    fashion: ['Chic', 'Vogue', 'Glam', 'Luxe', 'Style', 'Trend', 'Posh', 'Allure', 'Velvet', 'Silk', 'Couture', 'Bella'],
    realestate: ['Estate', 'Manor', 'Haven', 'Realty', 'Domain', 'Property', 'Casa', 'Villa', 'Abode', 'Hearth', 'Premier', 'Land']
};

const suffixes = {
    tech: ['Hub', 'Lab', 'Tech', 'Soft', 'Sys', 'Ware', 'Net', 'Core', 'Stack', 'Cloud', 'Grid', 'Logic'],
    creative: ['Studio', 'Works', 'Co', 'Lab', 'Hub', 'Space', 'House', 'Box', 'Crew', 'Loft', 'Den', 'Mode'],
    business: ['Group', 'Co', 'Inc', 'Corp', 'Partners', 'Solutions', 'Services', 'Consulting', 'Ventures', 'Enterprises', 'Holdings', 'Associates'],
    finance: ['Capital', 'Group', 'Partners', 'Advisors', 'Wealth', 'Bank', 'Financial', 'Investments', 'Holdings', 'Trust', 'Equity', 'Fund'],
    health: ['Care', 'Health', 'Wellness', 'Med', 'Life', 'Vital', 'Fit', 'Yoga', 'Spa', 'Center', 'Clinic', 'Studio'],
    food: ['Kitchen', 'Eats', 'Foods', 'Cafe', 'Bistro', 'Diner', 'Grill', 'Pantry', 'Table', 'House', 'Co', 'Bites'],
    fashion: ['Boutique', 'Atelier', 'Couture', 'Label', 'Wear', 'Apparel', 'Threads', 'Style', 'Closet', 'Collection', 'Brand', 'Lux'],
    realestate: ['Realty', 'Estates', 'Properties', 'Homes', 'Group', 'Partners', 'Associates', 'Developers', 'Holdings', 'Co', 'Trust', 'Capital']
};

function generateNames() {
    const keyword = document.getElementById('bnKeyword').value.trim();
    const industry = document.getElementById('bnIndustry').value;
    const count = 12;
    
    const prefixList = prefixes[industry] || prefixes.business;
    const suffixList = suffixes[industry] || suffixes.business;
    
    const names = new Set();
    const cleanKeyword = keyword ? keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase() : '';
    
    while (names.size < count) {
        const pattern = Math.floor(Math.random() * 5);
        let name = '';
        const prefix = prefixList[Math.floor(Math.random() * prefixList.length)];
        const suffix = suffixList[Math.floor(Math.random() * suffixList.length)];
        
        if (cleanKeyword) {
            switch(pattern) {
                case 0: name = prefix + cleanKeyword; break;
                case 1: name = cleanKeyword + suffix; break;
                case 2: name = prefix + cleanKeyword + suffix; break;
                case 3: name = cleanKeyword + ' ' + suffix; break;
                case 4: name = prefix + ' ' + cleanKeyword; break;
            }
        } else {
            switch(pattern) {
                case 0: name = prefix + suffix; break;
                case 1: name = prefix + ' ' + suffix; break;
                case 2: name = prefix + 'ly'; break;
                case 3: name = prefix + 'io'; break;
                case 4: name = prefix + suffix.toLowerCase(); break;
            }
        }
        
        names.add(name);
    }
    
    const resultDiv = document.getElementById('bnResults');
    resultDiv.innerHTML = Array.from(names).map(name => `
        <div class="name-card" onclick="copyToClipboard('${name}')">
            <h3>${name}</h3>
            <div class="name-actions">
                <span style="font-size:0.75rem; color:var(--gray);">.com</span>
                <span style="font-size:0.75rem; color:var(--primary); cursor:pointer;">
                    <i class="fas fa-copy"></i> Copy
                </span>
            </div>
        </div>
    `).join('');
    
    document.getElementById('bnResultsContainer').style.display = 'block';
    showToast('12 names generated!');
}

function checkDomain(name) {
    window.open(`https://www.namecheap.com/domains/registration/results/?domain=${name}.com`, '_blank');
}
