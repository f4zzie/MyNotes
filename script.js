// ========================================
// Global State
// ========================================
let contentStructure = null;
const TYPED_STRINGS = [
    'Cybersecurity Enthusiast',
    'CTF Player',
    'Malware Analyst',
    'Reverse Engineer',
    'Binary Exploiter'
];

// ========================================
// DOM Elements
// ========================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const navbar = $('#navbar');
const hamburger = $('#hamburger');
const navMenu = $('#nav-menu');
const themeToggle = $('#theme-toggle');
const searchToggle = $('#search-toggle');
const searchModal = $('#search-modal');
const searchInput = $('#search-input');
const searchResults = $('#search-results');
const backToTop = $('#back-to-top');
const scrollProgress = $('#scroll-progress');
const mainContent = $('#main-content');
const contentView = $('#content-view');

// ========================================
// Theme Management
// ========================================
function initTheme() {
    const saved = localStorage.getItem('theme');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    if (saved === 'light') {
        body.classList.remove('dark-theme');
        icon.className = 'fas fa-moon';
    } else {
        body.classList.add('dark-theme');
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

function toggleTheme() {
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    body.classList.toggle('dark-theme');

    if (body.classList.contains('dark-theme')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
}

// ========================================
// Mobile Navigation
// ========================================
function toggleMobileNav() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMobileNav() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// ========================================
// Scroll Handling
// ========================================
function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar scroll effect
    navbar.classList.toggle('scrolled', scrollY > 20);

    // Progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    // Back to top
    backToTop.classList.toggle('visible', scrollY > 400);

    // Active nav link
    highlightActiveNav();
}

function highlightActiveNav() {
    const scrollPos = window.scrollY + 120;
    $$('section[id]').forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = $(`.nav-link[href="#${id}"]`);
        if (link) {
            if (scrollPos >= top && scrollPos < top + height) {
                $$('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// ========================================
// Search
// ========================================
function openSearch() {
    searchModal.classList.add('active');
    searchInput.value = '';
    searchInput.focus();
    document.body.style.overflow = 'hidden';
    showSearchHint();
}

function closeSearch() {
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
}

function showSearchHint() {
    searchResults.innerHTML = `
        <div class="search-hint">
            <i class="fas fa-lightbulb"></i>
            <p>Type to search through all notes and writeups</p>
        </div>
    `;
}

function performSearch(query) {
    if (!contentStructure || !query.trim()) {
        showSearchHint();
        return;
    }

    const q = query.toLowerCase();
    const results = [];

    Object.entries(contentStructure.categories).forEach(([key, cat]) => {
        cat.writeups.forEach(w => {
            const searchStr = `${w.title} ${w.description} ${w.category} ${w.difficulty} ${cat.name}`.toLowerCase();
            if (searchStr.includes(q)) {
                results.push({ ...w, categoryKey: key, categoryName: cat.name, icon: cat.icon, encodedPath: encodePath(w.path) });
            }
        });
    });

    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-hint">
                <i class="fas fa-search"></i>
                <p>No results found for "${escapeHTML(query)}"</p>
            </div>
        `;
        return;
    }

    searchResults.innerHTML = results.map(r => `
        <div class="search-result-item" onclick="closeSearch(); showWriteup('${r.categoryKey}', '${r.encodedPath}')">
            <div class="result-icon"><i class="fas ${r.icon}"></i></div>
            <div class="result-info">
                <div class="result-title">${escapeHTML(r.title)}</div>
                <div class="result-meta">${escapeHTML(r.categoryName)} &bull; ${escapeHTML(r.difficulty)}</div>
            </div>
        </div>
    `).join('');
}

// ========================================
// Typing Effect
// ========================================
function initTypingEffect() {
    const el = $('.typed-text');
    if (!el) return;

    let stringIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeout;

    function type() {
        const current = TYPED_STRINGS[stringIdx];
        if (isDeleting) {
            el.textContent = current.substring(0, charIdx--);
            timeout = charIdx < 0 ? 500 : 40;
            if (charIdx < 0) {
                isDeleting = false;
                stringIdx = (stringIdx + 1) % TYPED_STRINGS.length;
            }
        } else {
            el.textContent = current.substring(0, charIdx++);
            timeout = charIdx > current.length ? 2000 : 80;
            if (charIdx > current.length) {
                isDeleting = true;
            }
        }
        setTimeout(type, timeout);
    }

    setTimeout(type, 1000);
}

// ========================================
// Counter Animation
// ========================================
function animateCounters() {
    $$('.stat-number[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + '+';
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    });
}

// ========================================
// Intersection Observer for Animations
// ========================================
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger counters when hero stats become visible
                if (entry.target.querySelector('.stat-number')) {
                    animateCounters();
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    $$('.animate-in, .stagger').forEach(el => observer.observe(el));
}

// ========================================
// Content Structure Loading
// ========================================
async function loadContentStructure() {
    try {
        const resp = await fetch('content-structure.json');
        contentStructure = await resp.json();
        renderCategories();
    } catch (err) {
        console.error('Failed to load content structure:', err);
    }
}

// ========================================
// Render Categories Grid
// ========================================
function renderCategories(filterKey = 'all') {
    if (!contentStructure) return;

    const grid = $('#categories-grid');
    if (!grid) return;

    const entries = Object.entries(contentStructure.categories);
    const filtered = filterKey === 'all'
        ? entries
        : entries.filter(([key]) => key === filterKey);

    grid.innerHTML = '';

    filtered.forEach(([key, cat]) => {
        const diffs = [...new Set(cat.writeups.map(w => w.difficulty.toLowerCase()))];
        const tags = [...new Set(cat.writeups.flatMap(w => [w.category]))].slice(0, 4);

        const card = document.createElement('div');
        card.className = 'category-card animate-in';
        card.setAttribute('data-category', key);
        card.onclick = () => showCategoryView(key);

        card.innerHTML = `
            <div class="category-card-header">
                <div class="category-card-icon"><i class="fas ${cat.icon}"></i></div>
                <div>
                    <h3>${cat.name}</h3>
                    <span class="note-count">${cat.writeups.length} note${cat.writeups.length !== 1 ? 's' : ''}</span>
                </div>
            </div>
            <p>${cat.description}</p>
            <div class="category-card-tags">
                ${tags.map(t => `<span class="mini-tag">${escapeHTML(t)}</span>`).join('')}
            </div>
            <div class="category-card-footer">
                <div class="difficulty-badges">
                    ${diffs.includes('beginner') || diffs.includes('easy') ? '<span class="diff-dot easy" title="Beginner"></span>' : ''}
                    ${diffs.includes('intermediate') || diffs.includes('medium') ? '<span class="diff-dot medium" title="Intermediate"></span>' : ''}
                    ${diffs.includes('advanced') || diffs.includes('hard') ? '<span class="diff-dot hard" title="Advanced"></span>' : ''}
                </div>
                <span class="view-link">Browse <i class="fas fa-arrow-right"></i></span>
            </div>
        `;

        grid.appendChild(card);
    });

    // Re-observe for animations
    setTimeout(() => {
        $$('.category-card.animate-in').forEach(el => {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
            }, { threshold: 0.1 });
            obs.observe(el);
        });
    }, 50);
}

// ========================================
// Filter Buttons
// ========================================
function initFilters() {
    $$('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCategories(btn.dataset.filter);
        });
    });
}

// ========================================
// Category View
// ========================================
function showCategoryView(categoryKey) {
    if (!contentStructure) return;
    const category = contentStructure.categories[categoryKey];
    if (!category) return;

    mainContent.style.display = 'none';
    contentView.style.display = 'block';
    contentView.innerHTML = `
        <div class="container">
            <div class="breadcrumb">
                <a href="#" onclick="returnToHome(); return false;">
                    <i class="fas fa-home"></i> Home
                </a>
                <i class="fas fa-chevron-right"></i>
                <span>${category.name}</span>
            </div>

            <div class="cat-header">
                <div class="cat-icon"><i class="fas ${category.icon}"></i></div>
                <h1>${category.name}</h1>
                <p>${category.description}</p>
            </div>

            <div class="writeups-grid stagger visible">
                ${category.writeups.map(w => `
                    <div class="writeup-card" onclick="showWriteup('${categoryKey}', '${encodePath(w.path)}')">
                        <div class="writeup-card-header">
                            <h3>${escapeHTML(w.title)}</h3>
                            <span class="difficulty-badge ${w.difficulty.toLowerCase()}">${w.difficulty}</span>
                        </div>
                        <p>${escapeHTML(w.description)}</p>
                        <div class="writeup-card-footer">
                            <span class="cat-badge">${escapeHTML(w.category)}</span>
                            <span class="read-more">Read <i class="fas fa-arrow-right"></i></span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// Writeup View
// ========================================
async function showWriteup(categoryKey, encodedPath) {
    const path = decodePath(encodedPath);
    const fetchUrl = path.split('/').map(s => encodeURIComponent(s)).join('/');

    try {
        const resp = await fetch(fetchUrl);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const markdown = await resp.text();
        const html = markdownToHTML(markdown, path);

        const category = contentStructure.categories[categoryKey];
        const writeup = category.writeups.find(w => w.path === path);
        if (!writeup) throw new Error('Writeup not found');

        mainContent.style.display = 'none';
        contentView.style.display = 'block';
        contentView.innerHTML = `
            <div class="container">
                <div class="breadcrumb">
                    <a href="#" onclick="returnToHome(); return false;">
                        <i class="fas fa-home"></i> Home
                    </a>
                    <i class="fas fa-chevron-right"></i>
                    <a href="#" onclick="showCategoryView('${categoryKey}'); return false;">
                        ${category.name}
                    </a>
                    <i class="fas fa-chevron-right"></i>
                    <span>${escapeHTML(writeup.title)}</span>
                </div>

                <article class="writeup-article">
                    ${html}
                </article>

                <div class="writeup-nav">
                    <button onclick="showCategoryView('${categoryKey}')" class="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i> Back to ${escapeHTML(category.name)}
                    </button>
                    <button onclick="returnToHome()" class="btn btn-primary">
                        <i class="fas fa-home"></i> Home
                    </button>
                </div>
            </div>
        `;

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Syntax highlighting
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }

        // Add copy buttons to code blocks
        addCopyButtons();

    } catch (err) {
        console.error('Error loading writeup:', err);
        contentView.innerHTML = `
            <div class="container" style="text-align: center; padding-top: 200px;">
                <h2 style="color: var(--text-primary); margin-bottom: 16px;">Failed to load content</h2>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">${escapeHTML(err.message)}</p>
                <button onclick="returnToHome()" class="btn btn-primary"><i class="fas fa-home"></i> Go Home</button>
            </div>
        `;
    }
}

// ========================================
// Return to Home
// ========================================
function returnToHome() {
    contentView.style.display = 'none';
    contentView.innerHTML = '';
    mainContent.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// Markdown Parser
// ========================================
function markdownToHTML(md, basePath = '') {
    const dirPath = basePath.split('/').slice(0, -1).join('/');
    let html = md;

    // Normalize line endings
    html = html.replace(/\r\n/g, '\n');

    // Escape HTML entities (except in code blocks)
    // We'll process code blocks first

    // Fenced code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/gm, (match, lang, code) => {
        const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const langClass = lang ? `language-${lang}` : '';
        return `<pre><code class="${langClass}">${escaped}</code></pre>`;
    });

    // Images (before links)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gm, (match, alt, src) => {
        let resolved = src;
        if (!src.startsWith('http') && !src.startsWith('/')) {
            if (src.includes('../')) {
                const parts = src.split('/');
                const base = dirPath.split('/').filter(Boolean);
                parts.forEach(p => {
                    if (p === '..') base.pop();
                    else if (p !== '.') base.push(p);
                });
                resolved = base.join('/');
            } else if (dirPath) {
                resolved = dirPath + '/' + src;
            }
        }
        return `<img src="${resolved}" alt="${escapeHTML(alt)}" loading="lazy" />`;
    });

    // Tables
    html = html.replace(/^(\|.+\|)\n(\|[-:| ]+\|)\n((?:\|.+\|\n?)*)/gm, (match, header, sep, bodyStr) => {
        const headers = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
        const rows = bodyStr.trim().split('\n').map(row => {
            const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    });

    // Headers
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Horizontal rules
    html = html.replace(/^---+$/gm, '<hr>');

    // Blockquotes
    html = html.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');
    // Merge consecutive blockquotes
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Inline code (after code blocks)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Unordered lists
    html = html.replace(/^(\s*)[-*]\s+(.+)$/gm, '$1<li>$2</li>');

    // Ordered lists
    html = html.replace(/^(\s*)\d+\.\s+(.+)$/gm, '$1<li>$2</li>');

    // Wrap consecutive li elements in ul/ol
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Paragraphs - wrap orphan text lines
    const lines = html.split('\n');
    const result = [];
    let inPre = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes('<pre>')) inPre = true;
        if (line.includes('</pre>')) { inPre = false; result.push(line); continue; }
        if (inPre) { result.push(line); continue; }

        if (line.trim() === '') {
            result.push('');
            continue;
        }

        // Don't wrap block elements
        if (/^<(h[1-6]|ul|ol|li|table|thead|tbody|tr|th|td|pre|blockquote|hr|img|div)/.test(line.trim())) {
            result.push(line);
        } else if (line.trim().startsWith('</')) {
            result.push(line);
        } else {
            result.push(`<p>${line}</p>`);
        }
    }

    return result.join('\n');
}

// ========================================
// Copy Buttons for Code Blocks
// ========================================
function addCopyButtons() {
    $$('.writeup-article pre').forEach(pre => {
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.textContent = 'Copy';
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const code = pre.querySelector('code');
            navigator.clipboard.writeText(code.textContent).then(() => {
                btn.textContent = 'Copied!';
                setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
            });
        });
        pre.style.position = 'relative';
        pre.appendChild(btn);
    });
}

// ========================================
// Utility Functions
// ========================================
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Encode a file path preserving slashes
function encodePath(p) {
    return p.split('/').map(s => encodeURIComponent(s)).join('/');
}

// Decode path segments
function decodePath(p) {
    return p.split('/').map(s => decodeURIComponent(s)).join('/');
}

function debounce(fn, wait = 16) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), wait);
    };
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            // If we're in content view, return home first
            if (contentView.style.display === 'block') {
                returnToHome();
                // Wait a bit for DOM update, then scroll
                setTimeout(() => {
                    const target = document.querySelector(href);
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - 64,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
                e.preventDefault();
                closeMobileNav();
                return;
            }

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 64,
                    behavior: 'smooth'
                });
            }
            closeMobileNav();
        });
    });
}

// ========================================
// Keyboard Shortcuts
// ========================================
function initKeyboard() {
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + K for search
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (searchModal.classList.contains('active')) {
                closeSearch();
            } else {
                openSearch();
            }
        }

        // Escape
        if (e.key === 'Escape') {
            if (searchModal.classList.contains('active')) {
                closeSearch();
            }
            closeMobileNav();
        }
    });
}

// ========================================
// Console Easter Egg
// ========================================
function showConsoleMessage() {
    console.log('%c🔒 f4zzie\'s Portfolio', 'font-size: 20px; color: #818cf8; font-weight: bold;');
    console.log('%cExploring cybersecurity one challenge at a time', 'font-size: 13px; color: #9ca0ab;');
    console.log('%cPress Ctrl+K to search notes!', 'font-size: 12px; color: #34d399;');
}

// ========================================
// Initialize Everything
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTypingEffect();
    initAnimations();
    initSmoothScroll();
    initFilters();
    initKeyboard();
    showConsoleMessage();

    // Event listeners
    themeToggle.addEventListener('click', toggleTheme);
    hamburger.addEventListener('click', toggleMobileNav);
    searchToggle.addEventListener('click', openSearch);
    searchInput.addEventListener('input', debounce(() => performSearch(searchInput.value), 200));
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', debounce(handleScroll, 10));

    // Close mobile nav on outside click
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileNav();
        }
    });

    // Load content
    loadContentStructure();

    // Initial scroll state
    handleScroll();

    // Trigger counter animation after a short delay (hero is immediately visible)
    setTimeout(animateCounters, 500);

    // Hash navigation on load
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
            }
        }, 300);
    }
});

// ========================================
// Make functions globally available
// ========================================
window.showCategoryView = showCategoryView;
window.showWriteup = showWriteup;
window.returnToHome = returnToHome;
window.closeSearch = closeSearch;
window.openSearch = openSearch;