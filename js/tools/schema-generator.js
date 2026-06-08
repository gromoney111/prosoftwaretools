// Schema Markup Generator Tool
function generateSchema() {
    const type = document.getElementById('schemaType').value;
    let schema = {};

    switch(type) {
        case 'localbusiness':
            schema = buildLocalBusiness();
            break;
        case 'article':
            schema = buildArticle();
            break;
        case 'product':
            schema = buildProduct();
            break;
        case 'faq':
            schema = buildFAQ();
            break;
        case 'organization':
            schema = buildOrganization();
            break;
        case 'person':
            schema = buildPerson();
            break;
    }

    if (!schema) return;

    const output = JSON.stringify(schema, null, 2);
    const scriptTag = '<script type="application/ld+json">\n' + output + '\n<\/script>';
    
    document.getElementById('schemaOutput').textContent = scriptTag;
    document.getElementById('schemaResult').style.display = 'block';
    showToast('Schema markup generated!');
}

function buildLocalBusiness() {
    const name = document.getElementById('sgName').value.trim();
    const desc = document.getElementById('sgDescription').value.trim();
    const url = document.getElementById('sgUrl').value.trim();
    const phone = document.getElementById('sgPhone').value.trim();
    const street = document.getElementById('sgStreet').value.trim();
    const city = document.getElementById('sgCity').value.trim();
    const state = document.getElementById('sgState').value.trim();
    const zip = document.getElementById('sgZip').value.trim();
    const country = document.getElementById('sgCountry').value.trim();
    const image = document.getElementById('sgImage').value.trim();

    if (!name) { showToast('Business name is required!', 'warning'); return null; }

    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": name
    };
    if (desc) schema.description = desc;
    if (url) schema.url = url;
    if (phone) schema.telephone = phone;
    if (image) schema.image = image;
    if (street || city) {
        schema.address = {
            "@type": "PostalAddress"
        };
        if (street) schema.address.streetAddress = street;
        if (city) schema.address.addressLocality = city;
        if (state) schema.address.addressRegion = state;
        if (zip) schema.address.postalCode = zip;
        if (country) schema.address.addressCountry = country;
    }
    return schema;
}

function buildArticle() {
    const title = document.getElementById('sgName').value.trim();
    const desc = document.getElementById('sgDescription').value.trim();
    const url = document.getElementById('sgUrl').value.trim();
    const image = document.getElementById('sgImage').value.trim();
    const author = document.getElementById('sgPhone').value.trim(); // repurposed field
    const published = document.getElementById('sgStreet').value.trim(); // repurposed
    const modified = document.getElementById('sgCity').value.trim(); // repurposed

    if (!title) { showToast('Article title is required!', 'warning'); return null; }

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title
    };
    if (desc) schema.description = desc;
    if (url) schema.url = url;
    if (image) schema.image = image;
    if (author) schema.author = { "@type": "Person", "name": author };
    if (published) schema.datePublished = published;
    if (modified) schema.dateModified = modified;
    return schema;
}

function buildProduct() {
    const name = document.getElementById('sgName').value.trim();
    const desc = document.getElementById('sgDescription').value.trim();
    const url = document.getElementById('sgUrl').value.trim();
    const image = document.getElementById('sgImage').value.trim();
    const price = document.getElementById('sgPhone').value.trim(); // repurposed
    const brand = document.getElementById('sgStreet').value.trim(); // repurposed
    const currency = document.getElementById('sgCity').value.trim() || 'USD';
    const rating = document.getElementById('sgState').value.trim();

    if (!name) { showToast('Product name is required!', 'warning'); return null; }

    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": name
    };
    if (desc) schema.description = desc;
    if (url) schema.url = url;
    if (image) schema.image = image;
    if (brand) schema.brand = { "@type": "Brand", "name": brand };
    if (price) {
        schema.offers = {
            "@type": "Offer",
            "price": price,
            "priceCurrency": currency,
            "availability": "https://schema.org/InStock"
        };
    }
    if (rating) {
        schema.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": rating,
            "bestRating": "5",
            "ratingCount": "100"
        };
    }
    return schema;
}

function buildFAQ() {
    const faqText = document.getElementById('sgDescription').value.trim();
    if (!faqText) { showToast('Please enter FAQ items!', 'warning'); return null; }

    const lines = faqText.split('\n').filter(l => l.trim());
    const items = [];
    
    for (let i = 0; i < lines.length; i += 2) {
        if (lines[i] && lines[i + 1]) {
            items.push({
                "@type": "Question",
                "name": lines[i].replace(/^Q:\s*/i, ''),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": lines[i + 1].replace(/^A:\s*/i, '')
                }
            });
        }
    }

    if (items.length === 0) { showToast('No valid Q&A pairs found!', 'error'); return null; }

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": items
    };
}

function buildOrganization() {
    const name = document.getElementById('sgName').value.trim();
    const desc = document.getElementById('sgDescription').value.trim();
    const url = document.getElementById('sgUrl').value.trim();
    const image = document.getElementById('sgImage').value.trim();
    const phone = document.getElementById('sgPhone').value.trim();

    if (!name) { showToast('Organization name is required!', 'warning'); return null; }

    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": name
    };
    if (desc) schema.description = desc;
    if (url) schema.url = url;
    if (image) schema.logo = image;
    if (phone) schema.telephone = phone;
    return schema;
}

function buildPerson() {
    const name = document.getElementById('sgName').value.trim();
    const desc = document.getElementById('sgDescription').value.trim();
    const url = document.getElementById('sgUrl').value.trim();
    const image = document.getElementById('sgImage').value.trim();
    const job = document.getElementById('sgPhone').value.trim(); // repurposed

    if (!name) { showToast('Person name is required!', 'warning'); return null; }

    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": name
    };
    if (desc) schema.description = desc;
    if (url) schema.url = url;
    if (image) schema.image = image;
    if (job) schema.jobTitle = job;
    return schema;
}

function changeSchemaType() {
    const type = document.getElementById('schemaType').value;
    const labels = {
        localbusiness: { phone: 'Phone Number', street: 'Street Address', city: 'City', state: 'State', zip: 'ZIP Code', country: 'Country' },
        article: { phone: 'Author Name', street: 'Date Published (YYYY-MM-DD)', city: 'Date Modified (YYYY-MM-DD)', state: '', zip: '', country: '' },
        product: { phone: 'Price', street: 'Brand Name', city: 'Currency (USD)', state: 'Rating (1-5)', zip: '', country: '' },
        faq: { phone: '', street: '', city: '', state: '', zip: '', country: '' },
        organization: { phone: 'Phone Number', street: '', city: '', state: '', zip: '', country: '' },
        person: { phone: 'Job Title', street: '', city: '', state: '', zip: '', country: '' }
    };

    const config = labels[type] || labels.localbusiness;
    const fields = ['sgPhone', 'sgStreet', 'sgCity', 'sgState', 'sgZip', 'sgCountry'];
    const labelKeys = ['phone', 'street', 'city', 'state', 'zip', 'country'];

    fields.forEach((id, i) => {
        const el = document.getElementById(id);
        const row = el.closest('.form-group');
        if (config[labelKeys[i]]) {
            row.style.display = '';
            row.querySelector('label').textContent = config[labelKeys[i]];
            el.placeholder = config[labelKeys[i]];
        } else {
            row.style.display = 'none';
        }
    });

    // Show FAQ hint
    const descLabel = document.querySelector('label[for="sgDescription"]');
    if (type === 'faq') {
        descLabel.innerHTML = 'FAQ Items <small style="font-weight:400; color:var(--gray);">(Q: on line 1, A: on line 2, repeat)</small>';
        document.getElementById('sgDescription').placeholder = 'Q: What is your product?\nA: Our product helps users create amazing websites.\nQ: How much does it cost?\nA: It is completely free to use.';
    } else {
        descLabel.textContent = 'Description';
        document.getElementById('sgDescription').placeholder = 'Brief description...';
    }
}

function copySchema() {
    const output = document.getElementById('schemaOutput').textContent;
    if (output) copyToClipboard(output);
    else showToast('Generate schema first!', 'warning');
}

function validateSchema() {
    window.open('https://validator.schema.org/', '_blank');
    showToast('Paste your schema in the validator!');
}
