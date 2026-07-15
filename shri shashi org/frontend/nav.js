// ═══════════════════════════════════════════════════════
// nav.js — Shared Navigation, Footer, Notification
// Include this in ALL pages before </body>
// ═══════════════════════════════════════════════════════

(function() {

// ── Which page is active ──
const PAGE = document.body.getAttribute('data-page') || '';

// ── SEARCH DATA (for global nav search) ──
const SEARCH_PAGES = [
  { title:'Home',           url:'index.html',        tag:'Page' },
  { title:'Toppers List',   url:'toppers.html',      tag:'Page' },
  { title:'Teachers',       url:'teachers.html',     tag:'Page' },
  { title:'Gallery',        url:'gallery.html',      tag:'Page' },
  { title:'Achievements',   url:'toppers.html', tag:'Page' },
  { title:'Admission Form', url:'admission.html',    tag:'Page' },
  { title:'Results',        url:'result.html',       tag:'Page' },
  { title:'Student Login',  url:'student-login.html',tag:'Login' },
  { title:'Admin Login',    url:'admin-login.html',  tag:'Login' },
  { title:'Anshika Rathour — District Rank 1 (95%)', url:'toppers.html', tag:'Topper' },
  { title:'Sarjana Rathour — Block Rank 3 (92.25%)', url:'toppers.html', tag:'Topper' },
  { title:'Dharni Singh Rathour — Class 8 Rank 1',   url:'toppers.html', tag:'Topper' },
  { title:'Navoday Selections',   url:'toppers.html', tag:'Achievement' },
  { title:'Republic Day Photos',  url:'gallery.html',      tag:'Gallery' },
  { title:'Annual Function',      url:'gallery.html',      tag:'Gallery' },
  { title:'Admission Open 2026-27', url:'admission.html',  tag:'Admission' },
  { title:'MP Board Results 2025-26', url:'result.html',   tag:'Result' },
  { title:'Contact School',       url:'index.html#about',  tag:'Contact' },
];

// ── INJECT HTML ──
function injectShared() {
  // 1. NOTIFICATION POPUP
  const notifHTML = `
  <div class="notif-overlay" id="notifOverlay" style="display:none">
    <div class="notif-box">
      <button class="notif-close" onclick="closeNotif()" title="Close">✕</button>
      <span class="notif-badge">📢 सूचना | NOTICE</span>
      <h2 class="notif-title">प्रवेश प्रारम्भ 2026-27</h2>
      <p class="notif-msg">श्री शशि हाई स्कूल गोरसी में नए सत्र के लिए प्रवेश शुरू हो गए हैं।</p>
      <div class="notif-topper-row">🏆 <strong>Anshika Rathour — District Rank 1</strong> | Class 5th | 95%</div>
      <div class="notif-highlight">🎓 <span>KG 1 से कक्षा 8वीं तक</span> — हिंदी माध्यम | MP Board<br/>📞 <span>9754345671 | 8435545050</span></div>
      <button class="notif-cta" onclick="window.location.href='admission.html'">अभी आवेदन करें → Apply Now</button>
    </div>
  </div>
  <button class="notif-float" id="notifFloat" onclick="showNotif()" title="Notifications">🔔</button>`;

  // 2. SOCIAL BAR
  const socialHTML = `
  <div class="social-bar">
    <div class="social-bar-left">
      <a href="tel:9754345671"><i class="fas fa-phone"></i> 9754345671</a>
      <a href="tel:8435545050"><i class="fas fa-phone"></i> 8435545050</a>
      <a href="mailto:shrishashihighschool@gmail.com"><i class="fas fa-envelope"></i> shrishashihighschool@gmail.com</a>
    </div>
    <div class="social-icons">
      <a href="https://www.instagram.com/shrishashihighschoolgorsi" target="_blank" class="ig" title="Instagram"><i class="fab fa-instagram"></i></a>
      <a href="https://www.facebook.com/share/1E8AM8gXNk/" target="_blank" class="fb" title="Facebook"><i class="fab fa-facebook-f"></i></a>
      <a href="https://whatsapp.com/channel/0029Va4uTQnCBtxCXXuJU510" target="_blank" class="wa" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
      <a href="https://youtu.be/I4tw0FCXAAY" target="_blank" class="yt" title="YouTube"><i class="fab fa-youtube"></i></a>
      <a href="mailto:shrishashihighschool@gmail.com" class="gm" title="Gmail"><i class="fas fa-envelope"></i></a>
    </div>
  </div>`;

  // 3. TICKER
  const tickerHTML = `
  <div class="ticker-bar">
    <span class="ticker-label">📢 अपडेट</span>
    <div class="ticker-track">
      <div class="ticker-content">
        <span class="ticker-item">🎓 प्रवेश प्रारम्भ 2026-27 | Admission Open <span class="new-tag">NEW</span></span>
        <span class="ticker-item">🏆 Anshika Rathour — District Rank 1 | Class 5th | 95% <span class="new-tag">NEW</span></span>
        <span class="ticker-item">📋 MP Board Result 2025-26 घोषित | Board Results Declared</span>
        <span class="ticker-item">🏅 Sarjana Rathour — Block Rank 3 | Class 5th | 92.25%</span>
        <span class="ticker-item">📞 संपर्क: 9754345671 | 8435545050 | 6264145423</span>
        <span class="ticker-item">🎓 प्रवेश प्रारम्भ 2026-27 | Admission Open <span class="new-tag">NEW</span></span>
        <span class="ticker-item">🏆 Anshika Rathour — District Rank 1 | Class 5th | 95% <span class="new-tag">NEW</span></span>
        <span class="ticker-item">📋 MP Board Result 2025-26 घोषित | Board Results Declared</span>
        <span class="ticker-item">🏅 Sarjana Rathour — Block Rank 3 | Class 5th | 92.25%</span>
        <span class="ticker-item">📞 संपर्क: 9754345671 | 8435545050 | 6264145423</span>
      </div>
    </div>
  </div>`;

  // 4. NAVBAR
  const links = [
    { id:'home',         label:'Home',            url:'index.html' },
    { id:'toppers',      label:'Toppers',         url:'toppers.html' },
    { id:'teachers',     label:'Teachers',        url:'teachers.html' },
    { id:'gallery',      label:'Gallery',         url:'gallery.html' },
    { id:'result',       label:'Result',          url:'result.html' },
    { id:'Brain Game',   label:'Brain Game',      url:'kbc-game.html' },
  ];
  const navLinksHTML = links.map(l =>
    `<button class="nav-link ${PAGE===l.id?'active':''}" onclick="location.href='${l.url}'">${l.label}</button>`
  ).join('');

  const navHTML = `
  <nav class="navbar" id="navbar">
    <a class="nav-brand" href="index.html">
      <div class="nav-logo-fallback">
        <img src="images/logo.png" alt="SSHS Logo" onerror="this.style.display='none';this.parentElement.innerHTML='श'">
      </div>
      <div>
        <div class="nav-name-hi">श्री शशि हाई स्कूल गोरसी</div>
        <div class="nav-name-en">Shri Shashi High School Gorsi | Est. 1998</div>
      </div>
    </a>
    <div class="nav-links">
      ${navLinksHTML}
      <!-- GLOBAL SEARCH -->
      <div class="nav-search-wrap">
        <i class="fas fa-search nav-search-icon"></i>
        <input class="nav-search-input" type="text" placeholder="Search..." id="navSearchInput" oninput="navSearch(this.value)" onblur="setTimeout(()=>closeNavSearch(),200)" autocomplete="off"/>
        <div class="nav-search-results" id="navSearchResults"></div>
      </div>
      <!-- LOGIN -->
      <div class="login-wrap" id="loginWrap">
        <button class="login-btn" id="loginToggle" onclick="toggleLogin(event)">
          <i class="fas fa-user-circle"></i> Login <i class="fas fa-chevron-down" style="font-size:.6rem" id="loginChevron"></i>
        </button>
        <div class="login-dropdown" id="loginDropdown">
          <a class="dropdown-item" href="admin-login.html">
            <div class="d-icon di-admin"><i class="fas fa-user-shield"></i></div>
            <div><div style="font-weight:600">Admin Login</div><div style="font-size:.72rem;color:var(--gray)">School Management</div></div>
          </a>
          <a class="dropdown-item" href="student-login.html">
            <div class="d-icon di-student"><i class="fas fa-user-graduate"></i></div>
            <div><div style="font-weight:600">Student Login</div><div style="font-size:.72rem;color:var(--gray)">Student Portal</div></div>
          </a>
        </div>
      </div>
      <button class="nav-admission" onclick="location.href='admission.html'">Admission Now</button>
    </div>
    <button class="hamburger" onclick="toggleMobile()" id="hamburger"><span></span><span></span><span></span></button>
  </nav>
  <!-- MOBILE MENU -->
  <div class="mobile-menu" id="mobileMenu">
    <div class="mobile-search">
      <i class="fas fa-search"></i>
      <input type="text" placeholder="Search..." oninput="navSearch(this.value)" id="mobileSearchInput"/>
      <div class="nav-search-results" id="mobileSearchResults" style="position:absolute;top:100%;left:0;right:0;z-index:999;display:none"></div>
    </div>
    ${links.map(l=>`<a class="mobile-link ${PAGE===l.id?'active':''}" href="${l.url}">${l.label}</a>`).join('')}
    <a class="mobile-link" href="student-login.html">🎒 Student Login</a>
    <a class="mobile-link" href="admin-login.html">🛡️ Admin Login</a>
    <div class="mobile-btns">
      <button class="nav-admission" onclick="location.href='admission.html'" style="width:100%">Admission Now</button>
    </div>
  </div>`;

  // 5. FOOTER
  const footerHTML = `
  <footer class="footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-brand-top">
          <div class="footer-logo-fb">
            <img src="images/logo.png" alt="Logo" onerror="this.style.display='none';this.parentElement.textContent='श'">
          </div>
          <div class="footer-school-name">श्री शशि हाई स्कूल गोरसी<br/><span style="font-family:'Poppins';font-size:.7rem;opacity:.55">Shri Shashi High School Gorsi</span></div>
        </div>
        <p>सेमरवार रोड, ग्राम गोरसी, खण्ड जैतहरी, जिला अनूपपुर (म.प्र.) — पिछले 30+ वर्षों से गुणवत्तापूर्ण शिक्षा का केंद्र।</p>
        <p style="margin-top:.3rem;font-style:italic;color:rgba(255,255,255,0.45);font-size:.75rem">"आप हमें बच्चे दीजिये! हम आपको कुशल नागरिक देंगे।"</p>
        <div class="footer-social" style="margin-top:1rem">
          <a href="https://www.instagram.com/shrishashihighschoolgorsi" target="_blank" class="ig"><i class="fab fa-instagram"></i></a>
          <a href="https://www.facebook.com/share/1E8AM8gXNk/" target="_blank" class="fb"><i class="fab fa-facebook-f"></i></a>
          <a href="https://whatsapp.com/channel/0029Va4uTQnCBtxCXXuJU510" target="_blank" class="wa"><i class="fab fa-whatsapp"></i></a>
          <a href="https://youtu.be/I4tw0FCXAAY" target="_blank" class="yt"><i class="fab fa-youtube"></i></a>
          <a href="mailto:shrishashihighschool@gmail.com" class="gm"><i class="fas fa-envelope"></i></a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><i class="fas fa-chevron-right" style="font-size:.6rem"></i><a href="toppers.html">Toppers</a></li>
          <li><i class="fas fa-chevron-right" style="font-size:.6rem"></i><a href="toppers.html">Achievements</a></li>
          <li><i class="fas fa-chevron-right" style="font-size:.6rem"></i><a href="gallery.html">Gallery</a></li>
          <li><i class="fas fa-chevron-right" style="font-size:.6rem"></i><a href="result.html">Results</a></li>
          <li><i class="fas fa-chevron-right" style="font-size:.6rem"></i><a href="teachers.html">Teachers</a></li>
          <li><i class="fas fa-chevron-right" style="font-size:.6rem"></i><a href="admission.html">Admission</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Student Zone</h4>
        <ul>
          <li><i class="fas fa-chevron-right" style="font-size:.6rem"></i><a href="student-login.html">Student Login</a></li>
          <li><i class="fas fa-chevron-right" style="font-size:.6rem"></i><a href="result.html">Check Result</a></li>
          <li><i class="fas fa-chevron-right" style="font-size:.6rem"></i><a href="toppers.html">Topper List</a></li>
          <li style="opacity:.5;cursor:default"> <i class="fas fa-chevron-right" style="font-size:.6rem"></i> Brain Booster Game</li>
          <li style="opacity:.5;cursor:default"><i class="fas fa-chevron-right" style="font-size:.6rem"></i> Online Test</li>
          <li style="opacity:.5;cursor:default"><i class="fas fa-chevron-right" style="font-size:.6rem"></i> Online Classes</li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Facilities</h4>
        <ul>
          <li style="cursor:default"><i class="fas fa-check" style="color:var(--gold2);font-size:.65rem"></i> Hindi Medium</li>
          <li style="cursor:default"><i class="fas fa-check" style="color:var(--gold2);font-size:.65rem"></i> MP Board</li>
          <li style="cursor:default"><i class="fas fa-check" style="color:var(--gold2);font-size:.65rem"></i> Smart Classes</li>
          <li style="cursor:default"><i class="fas fa-check" style="color:var(--gold2);font-size:.65rem"></i> Transport</li>
          <li style="cursor:default"><i class="fas fa-check" style="color:var(--gold2);font-size:.65rem"></i> Sports Ground</li>
          <li style="cursor:default"><i class="fas fa-check" style="color:var(--gold2);font-size:.65rem"></i> Free Registration</li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul>
          <li style="cursor:default"><i class="fas fa-phone" style="color:var(--gold2);font-size:.68rem"></i> 9754345671</li>
          <li style="cursor:default"><i class="fas fa-phone" style="color:var(--gold2);font-size:.68rem"></i> 8435545050</li>
          <li style="cursor:default"><i class="fas fa-phone" style="color:var(--gold2);font-size:.68rem"></i> 6264145423</li>
          <li style="cursor:default;word-break:break-all;font-size:.72rem"><i class="fas fa-envelope" style="color:var(--gold2);font-size:.68rem"></i> shrishashihighschool@gmail.com</li>
          <li style="cursor:default"><i class="fas fa-clock" style="color:var(--gold2);font-size:.68rem"></i> Mon–Sat: 10AM–4PM</li>
          <li style="cursor:default"><i class="fas fa-map-marker-alt" style="color:var(--gold2);font-size:.68rem"></i> Gorsi, Anuppur (M.P.)</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Shri Shashi High School Gorsi. All Rights Reserved.</p>
      <p>Made with ❤️ for Quality Education</p>
    </div>
  </footer>`;

  // 6. WHATSAPP FLOAT
  const waHTML = `<a href="https://wa.me/919977236020" target="_blank" class="wa-float" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>`;

  // ── INJECT at start of body ──
  document.body.insertAdjacentHTML('afterbegin', notifHTML + socialHTML + tickerHTML + navHTML);
  // ── INJECT at end of body ──
  document.body.insertAdjacentHTML('beforeend', footerHTML + waHTML);
}

// ── NOTIFICATION FUNCTIONS ──
let autoCloseTimer;
window.closeNotif = function() {
  document.getElementById('notifOverlay').style.display='none';
  document.getElementById('notifFloat').classList.add('show');
};
window.showNotif = function() {
  document.getElementById('notifOverlay').style.display='flex';
  document.getElementById('notifFloat').classList.remove('show');
  clearTimeout(autoCloseTimer);
  autoCloseTimer = setTimeout(()=>{
    const el = document.getElementById('notifOverlay');
    if(el) { el.style.opacity='0'; el.style.transition='opacity .5s';
      setTimeout(()=>{ el.style.display='none'; el.style.opacity=''; window.closeNotif&&document.getElementById('notifFloat').classList.add('show'); },500); }
  }, 10000);
};
// Outside click closes popup
document.addEventListener('click', function(e) {
  const overlay = document.getElementById('notifOverlay');
  if(overlay && e.target === overlay) window.closeNotif();
});

// ── LOGIN DROPDOWN ──
let loginOpen = false;
window.toggleLogin = function(e) {
  e.stopPropagation(); loginOpen=!loginOpen;
  document.getElementById('loginDropdown').classList.toggle('open', loginOpen);
  document.getElementById('loginChevron').style.transform = loginOpen ? 'rotate(180deg)' : '';
};
document.addEventListener('click', function(e) {
  const lw = document.getElementById('loginWrap');
  if(lw && !lw.contains(e.target)) {
    loginOpen=false;
    const dd = document.getElementById('loginDropdown');
    const lc = document.getElementById('loginChevron');
    if(dd) dd.classList.remove('open');
    if(lc) lc.style.transform='';
  }
});

// ── MOBILE MENU ──
window.toggleMobile = function() {
  document.getElementById('mobileMenu').classList.toggle('open');
};

// ── GLOBAL SEARCH ──
window.navSearch = function(q) {
  const query = q.toLowerCase().trim();
  const desktopRes = document.getElementById('navSearchResults');
  const mobileRes  = document.getElementById('mobileSearchResults');
  if(!query) { if(desktopRes) {desktopRes.classList.remove('open'); desktopRes.innerHTML='';} if(mobileRes) mobileRes.style.display='none'; return; }
  const filtered = SEARCH_PAGES.filter(p =>
    p.title.toLowerCase().includes(query) || p.tag.toLowerCase().includes(query)
  ).slice(0, 8);
  const html = filtered.length
    ? filtered.map(p=>`<div class="search-result-item" onclick="location.href='${p.url}'">
        <div class="search-result-title">${p.title}<span class="search-result-tag">${p.tag}</span></div>
      </div>`).join('')
    : `<div class="search-result-item"><div class="search-result-title" style="color:var(--gray)">No results found</div></div>`;
  if(desktopRes) { desktopRes.innerHTML=html; desktopRes.classList.add('open'); }
  if(mobileRes)  { mobileRes.innerHTML=html; mobileRes.style.display='block'; }
};
window.closeNavSearch = function() {
  const el = document.getElementById('navSearchResults');
  if(el) { el.classList.remove('open'); }
};

// ── NAVBAR SCROLL SHADOW ──
window.addEventListener('scroll', function() {
  const nav = document.getElementById('navbar');
  if(nav) nav.style.boxShadow = window.scrollY>50 ? '0 4px 30px rgba(11,37,69,0.2)' : '0 2px 20px rgba(11,37,69,0.1)';
});

// ── RUN ──
injectShared();

// Show notification after 1.5s
setTimeout(()=>window.showNotif(), 1500);

})();
