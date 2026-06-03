// ===== ProSoftwareTools - Main JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSearch();
    initScrollEffects();
    initDropdowns();
});

// ===== Mobile Menu Toggle =====
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (toggle && navMenu) {
        toggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = toggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu on link click
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = toggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// ===== Dropdown for Mobile =====
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown > a');
    dropdowns.forEach(function(dropdown) {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.parentElement.classList.toggle('active');
            }
        });
    });
}

// ===== Search Functionality =====
function initSearch() {
    const heroSearch = document.getElementById('heroSearch');
    const searchInput = document.getElementById('searchInput');

    const tools = [
        { name: 'Word Counter', url: 'tools/word-counter.html' },
        { name: 'Case Converter', url: 'tools/case-converter.html' },
        { name: 'QR Code Generator', url: 'tools/qr-code-generator.html' },
        { name: 'Password Generator', url: 'tools/password-generator.html' },
        { name: 'Image Resizer', url: 'tools/image-resizer.html' },
        { name: 'JSON Formatter', url: 'tools/json-formatter.html' },
        { name: 'Base64 Encoder', url: 'tools/base64-encoder.html' },
        { name: 'Color Picker', url: 'tools/color-picker.html' },
        { name: 'MD5 Generator', url: 'tools/md5-generator.html' },
        { name: 'URL Encoder/Decoder', url: 'tools/url-encoder-decoder.html' },
        { name: 'URL Shortener', url: 'tools/url-shortener.html' },
        { name: 'Image Watermark', url: 'tools/image-watermark.html' },
        { name: 'Resume Maker', url: 'tools/resume-maker.html' },
        { name: 'Cover Letter Generator', url: 'tools/cover-letter-generator.html' },
        { name: 'Business Name Generator', url: 'tools/business-name-generator.html' },
        { name: 'Meta Tag Generator', url: 'tools/meta-tag-generator.html' },
        { name: 'Schema Markup Generator', url: 'tools/schema-generator.html' }
    ];

    function handleSearch(input) {
        if (!input) return;
        input.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.toLowerCase().trim();
                if (query) {
                    const match = tools.find(t => t.name.toLowerCase().includes(query));
                    if (match) {
                        // Determine relative path
                        const isSubpage = window.location.pathname.includes('/tools/') || 
                                         window.location.pathname.includes('/categories/');
                        const prefix = isSubpage ? '../' : '';
                        window.location.href = prefix + match.url;
                    }
                }
            }
        });
    }

    handleSearch(heroSearch);
    handleSearch(searchInput);
}

// ===== Scroll Effects =====
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }
    });

    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.tool-card, .category-card, .feature-card, .user-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== Utility Functions =====
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 14px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b'};
        color: white;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: fadeInUp 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard!');
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Copied to clipboard!');
}
