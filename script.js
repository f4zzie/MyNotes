'use strict';

// ============================================================
// State
// ============================================================
var data = null;

// ============================================================
// DOM refs
// ============================================================
var $progress  = document.getElementById('progress');
var $nav       = document.getElementById('main-nav');
var $hamburger = document.getElementById('hamburger');
var $themeBtn  = document.getElementById('theme-btn');
var $searchBtn = document.getElementById('search-btn');
var $searchMod = document.getElementById('search-modal');
var $searchIn  = document.getElementById('search-input');
var $searchOut = document.getElementById('search-out');
var $homeView  = document.getElementById('home-view');
var $pageView  = document.getElementById('page-view');
var $groups    = document.getElementById('groups');
var $backTop   = document.getElementById('back-top');

// ============================================================
// Theme
// ============================================================
(function() {
    var saved = localStorage.getItem('theme');
    document.body.className = (saved === 'light') ? 'light' : 'dark';
    syncThemeIcon();
})();

function syncThemeIcon() {
    var i = $themeBtn.querySelector('i');
    i.className = document.body.classList.contains('dark')
        ? 'fas fa-circle-half-stroke'
        : 'fas fa-moon';
}

$themeBtn.addEventListener('click', function() {
    if (document.body.classList.contains('dark')) {
        document.body.className = 'light';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.className = 'dark';
        localStorage.setItem('theme', 'dark');
    }
    syncThemeIcon();
});

// ============================================================
// Mobile nav
// ============================================================
$hamburger.addEventListener('click', function() {
    $hamburger.classList.toggle('open');
    $nav.classList.toggle('open');
});

document.addEventListener('click', function(e) {
    if (!$hamburger.contains(e.target) && !$nav.contains(e.target)) {
        $hamburger.classList.remove('open');
        $nav.classList.remove('open');
    }
});

function closeNav() {
    $hamburger.classList.remove('open');
    $nav.classList.remove('open');
}

// ============================================================
// Scroll progress + back-to-top
// ============================================================
window.addEventListener('scroll', function() {
    var scrolled = window.scrollY;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    $progress.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
    if (scrolled > 280) {
        $backTop.classList.remove('hidden');
    } else {
        $backTop.classList.add('hidden');
    }
});

$backTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// Search
// ============================================================
$searchBtn.addEventListener('click', openSearch);

function openSearch() {
    $searchMod.classList.remove('hidden');
    $searchIn.focus();
    $searchIn.value = '';
    $searchOut.innerHTML = '<div class="search-empty">Start typing to search writeups...</div>';
    document.body.style.overflow = 'hidden';
}

window.closeSearch = function() {
    $searchMod.classList.add('hidden');
    document.body.style.overflow = '';
};

$searchIn.addEventListener('input', function() {
    var q = $searchIn.value.trim().toLowerCase();
    if (!q || !data) {
        $searchOut.innerHTML = '<div class="search-empty">Start typing to search writeups...</div>';
        return;
    }

    var hits = [];
    Object.keys(data.categories).forEach(function(key) {
        var cat = data.categories[key];
        cat.writeups.forEach(function(w) {
            var txt = (w.title + ' ' + w.description + ' ' + cat.name + ' ' + w.category).toLowerCase();
            if (txt.includes(q)) {
                hits.push({ title: w.title, desc: w.description, catKey: key, catName: cat.name, icon: cat.icon, path: w.path, diff: w.difficulty });
            }
        });
    });

    if (!hits.length) {
        $searchOut.innerHTML = '<div class="search-empty">No results for \u201c' + esc(q) + '\u201d</div>';
        return;
    }

    $searchOut.innerHTML = hits.map(function(h) {
        return '<div class="s-hit" onclick="closeSearch(); showWriteup(\'' + h.catKey + '\', \'' + enc(h.path) + '\')">' +
            '<div class="s-hit-icon"><i class="fas ' + esc(h.icon) + '"></i></div>' +
            '<div><div class="s-hit-title">' + esc(h.title) + '</div>' +
            '<div class="s-hit-sub">' + esc(h.catName) + ' \u00B7 ' + esc(h.diff) + '</div></div>' +
            '</div>';
    }).join('');
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (!$searchMod.classList.contains('hidden')) window.closeSearch();
        closeNav();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        $searchMod.classList.contains('hidden') ? openSearch() : window.closeSearch();
    }
});

// ============================================================
// Date helper — simulated, working back from Mar 7, 2026
// ============================================================
function makeDate(idx) {
    var d = new Date(2026, 2, 7);
    d.setDate(d.getDate() - idx * 6);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ============================================================
// Badge + difficulty class maps
// ============================================================
var BADGE_MAP = {
    HTB: 'b-htb',
    THM: 'b-thm',
    RE: 'b-re',
    MALWARE: 'b-malware',
    CYBERSTUDENTS: 'b-cyberstudents',
    RESOURCES: 'b-resources'
};

var TYPE_MAP = {
    HTB: 'CTF',
    THM: 'CTF',
    CYBERSTUDENTS: 'CTF',
    RE: 'NOTE',
    MALWARE: 'NOTE',
    RESOURCES: 'NOTE'
};

function diffClass(d) {
    d = d.toLowerCase();
    if (d === 'easy' || d === 'beginner') return 'd-easy';
    if (d === 'hard' || d === 'advanced') return 'd-hard';
    return 'd-med';
}

function readTime(title) {
    return Math.max(3, Math.min(10, title.split(/\s+/).length + 2));
}

// ============================================================
// Render a single post-item
// ============================================================
function postItem(w, idx, catKey, catName) {
    var bc = BADGE_MAP[catKey] || 'b-default';
    var dc = diffClass(w.difficulty);
    var t = TYPE_MAP[catKey] || 'NOTE';
    var tc = (t === 'CTF') ? 't-ctf' : 't-note';
    return '<article class="post-item" onclick="showWriteup(\'' + catKey + '\', \'' + enc(w.path) + '\')">' +
        '<div class="p-badges">' +
            '<span class="badge ' + bc + '">' + esc(catName).toUpperCase() + '</span>' +
            '<span class="type ' + tc + '">' + t + '</span>' +
            '<span class="diff ' + dc + '">' + esc(w.difficulty) + '</span>' +
        '</div>' +
        '<p class="post-title">' + esc(w.title) + '</p>' +
        '<p class="post-desc">' + esc(w.description) + '</p>' +
        '<div class="post-meta">' +
            '<span>' + makeDate(idx) + '</span>' +
            '<span class="sep">\u00B7</span>' +
            '<span>' + readTime(w.title) + ' min read</span>' +
        '</div>' +
    '</article>';
}

// ============================================================
// Load content-structure.json
// ============================================================
async function loadData() {
    try {
        var r = await fetch('content-structure.json');
        data = await r.json();
        renderGroups();
    } catch(e) {
        console.error('Failed to load content:', e);
    }
}

function flatPosts() {
    var out = [], i = 0;
    Object.keys(data.categories).forEach(function(key) {
        var cat = data.categories[key];
        cat.writeups.forEach(function(w) {
            out.push(Object.assign({}, w, { catKey: key, catName: cat.name, idx: i++ }));
        });
    });
    return out;
}

function renderGroups() {
    var html = '';
    var globalIdx = 0;
    Object.keys(data.categories).forEach(function(key) {
        var cat = data.categories[key];
        if (!cat.writeups.length) return;
        html += '<div class="cat-group">' +
            '<div class="cat-group-head">' +
                '<h2 class="cat-group-label">' + esc(cat.name) + '</h2>' +
                '<a href="#" class="cat-group-all" onclick="showCategory(\'' + key + '\'); return false;">View all &rarr;</a>' +
            '</div>';
        html += postItem(cat.writeups[0], globalIdx++, key, cat.name);
        globalIdx += cat.writeups.length - 1;
        html += '</div>';
    });
    $groups.innerHTML = html;
}

// ============================================================
// Page transitions
// ============================================================
function showHomePage() {
    $homeView.classList.remove('hidden');
    $pageView.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPage(html) {
    $homeView.classList.add('hidden');
    $pageView.classList.remove('hidden');
    $pageView.innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Breadcrumb helper
function trail(crumbs, current) {
    var h = '<div class="trail">';
    crumbs.forEach(function(c) {
        h += '<a href="#" onclick="' + c.fn + '; return false;">' + esc(c.label) + '</a>';
        h += '<i class="fas fa-chevron-right sep"></i>';
    });
    h += '<span>' + esc(current) + '</span></div>';
    return h;
}

// ============================================================
// Navigation — all exposed on window for inline onclick
// ============================================================
window.goHome = function() {
    closeNav();
    showHomePage();
};

window.showAll = function() {
    closeNav();
    if (!data) return;
    var all = flatPosts();
    showPage(
        '<div class="pg">' +
            trail([{ label: 'Home', fn: 'goHome()' }], 'All Posts') +
            '<h1 class="listing-title">All Posts</h1>' +
            '<p class="listing-sub">' + all.length + ' articles</p>' +
            all.map(function(p) { return postItem(p, p.idx, p.catKey, p.catName); }).join('') +
        '</div>'
    );
};

window.showCategory = function(key) {
    closeNav();
    if (!data) return;
    var cat = data.categories[key];
    if (!cat) return;
    var i = 0;
    showPage(
        '<div class="pg">' +
            trail([{ label: 'Home', fn: 'goHome()' }], cat.name) +
            '<h1 class="listing-title">' + esc(cat.name) + '</h1>' +
            '<p class="listing-sub">' + esc(cat.description) + '</p>' +
            cat.writeups.map(function(w) { return postItem(w, i++, key, cat.name); }).join('') +
        '</div>'
    );
};

window.showAbout = function() {
    closeNav();
    showPage(
        '<div class="pg">' +
            trail([{ label: 'Home', fn: 'goHome()' }], 'Whoami') +
            '<div class="about-block">' +
                '<h1>$ whoami</h1>' +
                '<p>Reverse engineering, binary exploitation, and malware analysis. Documenting everything I pick up along the way.</p>' +
                '<p>Most of my time goes into HackTheBox, TryHackMe, and CyberStudents \u2014 pulling apart binaries, writing exploits, figuring out how things break. These aren\u2019t polished tutorials. They\u2019re real notes from real practice.</p>' +
                '<p>Focus: RE \u00B7 Malware Analysis \u00B7 Binary Exploitation \u00B7 CTF</p>' +
                '<div class="about-nums">' +
                    '<div class="about-num"><strong>30+</strong><span>Notes</span></div>' +
                    '<div class="about-num"><strong>6</strong><span>Categories</span></div>' +
                    '<div class="about-num"><strong>3</strong><span>Platforms</span></div>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
};

window.showWriteup = async function(catKey, encodedPath) {
    var path = dec(encodedPath);
    var cat = data && data.categories[catKey];
    var writeup = cat && cat.writeups.find(function(w) { return w.path === path; });

    try {
        var fetchUrl = path.split('/').map(encodeURIComponent).join('/');
        var r = await fetch(fetchUrl);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        var md = await r.text();
        var html = parseMarkdown(md, path);

        showPage(
            '<div class="pg">' +
                trail(
                    [
                        { label: 'Home', fn: 'goHome()' },
                        { label: cat.name, fn: 'showCategory(\'' + catKey + '\')' }
                    ],
                    writeup ? writeup.title : 'Writeup'
                ) +
                '<div class="wu">' + html + '</div>' +
                '<div class="wu-nav">' +
                    '<button class="btn-nav" onclick="showCategory(\'' + catKey + '\')"><i class="fas fa-arrow-left"></i> ' + esc(cat.name) + '</button>' +
                    '<button class="btn-nav" onclick="goHome()"><i class="fas fa-home"></i> Home</button>' +
                '</div>' +
            '</div>'
        );

        if (window.Prism) Prism.highlightAll();
        addCopyBtns();

    } catch(e) {
        showPage(
            '<div class="pg" style="padding-top:48px;">' +
                '<p style="color:var(--text-dim);margin-bottom:12px;">Could not load: ' + esc(e.message) + '</p>' +
                '<button class="btn-nav" onclick="goHome()">\u2190 Home</button>' +
            '</div>'
        );
    }
};

// ============================================================
// Copy buttons for code blocks in writeups
// ============================================================
function addCopyBtns() {
    document.querySelectorAll('.wu pre').forEach(function(pre) {
        if (pre.querySelector('.copy-btn')) return;
        var btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.textContent = 'copy';
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var code = pre.querySelector('code');
            navigator.clipboard.writeText(code ? code.textContent : pre.textContent).then(function() {
                btn.textContent = 'copied!';
                setTimeout(function() { btn.textContent = 'copy'; }, 1800);
            });
        });
        pre.appendChild(btn);
    });
}

// ============================================================
// Markdown parser
// ============================================================
function parseMarkdown(md, filePath) {
    var dir = filePath ? filePath.split('/').slice(0, -1).join('/') : '';
    var h = md.replace(/\r\n/g, '\n');

    // Fenced code blocks — must come first
    h = h.replace(/```(\w*)\n([\s\S]*?)```/gm, function(_, lang, code) {
        var safe = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return '<pre><code class="' + (lang ? 'language-' + lang : '') + '">' + safe + '</code></pre>';
    });

    // Images with relative path resolution
    h = h.replace(/!\[([^\]]*)\]\(([^)]+)\)/gm, function(_, alt, src) {
        if (!src.startsWith('http') && !src.startsWith('/') && dir) {
            src = dir + '/' + src;
        }
        return '<img src="' + src.replace(/"/g, '&quot;') + '" alt="' + esc(alt) + '" loading="lazy">';
    });

    // Tables
    h = h.replace(/^(\|.+\|)\n\|[-:| ]+\|\n((?:\|.+\|\n?)+)/gm, function(_, hdr, body) {
        var ths = hdr.split('|').filter(function(c) { return c.trim(); })
            .map(function(c) { return '<th>' + c.trim() + '</th>'; }).join('');
        var rows = body.trim().split('\n').map(function(row) {
            var cells = row.split('|').filter(function(c) { return c.trim(); })
                .map(function(c) { return '<td>' + c.trim() + '</td>'; }).join('');
            return '<tr>' + cells + '</tr>';
        }).join('');
        return '<table><thead><tr>' + ths + '</tr></thead><tbody>' + rows + '</tbody></table>';
    });

    // Headings
    h = h.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    h = h.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    h = h.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    h = h.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Horizontal rule
    h = h.replace(/^---+$/gm, '<hr>');

    // Blockquote
    h = h.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

    // Inline formatting
    h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/\*(.+?)\*/g, '<em>$1</em>');
    h = h.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Inline code (after fenced blocks are handled)
    h = h.replace(/`([^`\n]+)`/g, '<code>$1</code>');

    // Links
    h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Lists
    h = h.replace(/^[ \t]*[-*] (.+)$/gm, '<li>$1</li>');
    h = h.replace(/^[ \t]*\d+\. (.+)$/gm, '<li>$1</li>');
    h = h.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Paragraphs — wrap bare text lines
    var lines = h.split('\n');
    var out = [];
    var inPre = false;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.indexOf('<pre>') !== -1) inPre = true;
        if (line.indexOf('</pre>') !== -1) { inPre = false; out.push(line); continue; }
        if (inPre) { out.push(line); continue; }
        if (!line.trim()) { out.push(''); continue; }
        if (/^<(h[1-6]|ul|ol|li|table|thead|tbody|tr|th|td|pre|blockquote|hr|img|div)/.test(line.trim())) {
            out.push(line);
        } else if (line.trim().charAt(0) === '<' && line.trim().charAt(1) === '/') {
            out.push(line);
        } else {
            out.push('<p>' + line + '</p>');
        }
    }
    return out.join('\n');
}

// ============================================================
// Utils
// ============================================================
function esc(s) {
    if (typeof s !== 'string') return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}
function enc(p) {
    return p.split('/').map(encodeURIComponent).join('/');
}
function dec(p) {
    return p.split('/').map(decodeURIComponent).join('/');
}

// ============================================================
// Boot
// ============================================================
loadData();
