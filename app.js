/**
 * Anil Dutta - Web Apps, Financial Insights & HELP Hub
 * Client-Side Application Logic
 */

// Application State
const state = {
  apps: [],
  articles: [],
  queries: [],
  activeAppFilter: 'All',
  activeArticleCategory: 'All',
  activeQueryStatus: 'All',
  searchQuery: '',
  adminMode: false,
  selectedApp: null,
  selectedArticle: null,
  targetAnswerQueryId: null
};

// Fallback data in case server API is offline or loaded via file:// protocol
const FALLBACK_APPS = [
  {
    id: "jobmatch-ai",
    title: "UK JobMatch AI",
    tagline: "Gemini-Powered CV Parsing & UK Job Search Agent",
    category: "AI & Career",
    badge: "AI Agent",
    status: "Production Ready",
    port: 8000,
    localUrl: "http://127.0.0.1:8000",
    githubUrl: "https://github.com/anildutta007/uk-jobmatch-ai",
    summary: "An intelligent web application tailored specifically for the UK job market. Users upload resumes (PDF, DOCX, TXT) and Google Gemini LLM extracts core competencies, queries live UK job listings across London and major regions, and delivers strict 10-point fit scoring with skill gaps and interview prep advice.",
    highlights: [
      "Gemini 2.5 Flash intelligence for role alignment & skill matching",
      "Live UK job aggregation (London, Manchester, Birmingham, Edinburgh, Remote)",
      "Strict scoring out of 10 with transparent rationale & gap identification",
      "Zero-cost architecture with two-stage local pre-filtering reducing LLM tokens by 80%"
    ],
    techStack: ["Python", "FastAPI", "Google Gemini 2.5", "Tailwind CSS", "Uvicorn"],
    batFile: "run.bat",
    icon: "sparkles",
    accentColor: "from-blue-600 to-indigo-600",
    statLabel: "Scoring Calibration",
    statValue: "10-Point Scale"
  },
  {
    id: "funds-advisor",
    title: "Dutta UK Funds Selection Advisor",
    tagline: "Institutional Trustnet 15-Year Performance Universe",
    category: "FinTech & Wealth",
    badge: "FinTech Lab",
    status: "Production Ready",
    port: 8080,
    localUrl: "http://127.0.0.1:8080",
    githubUrl: "https://github.com/anildutta007/uk-funds-advisor",
    summary: "An institutional-grade UK fund screener and portfolio analytics workbench built on FE fundinfo Trustnet multi-house data. Features 15-year annual calendar returns, Alpha, FE Crown ratings, Ongoing Charges Figures (OCF), and benchmark comparisons across premier UK asset managers.",
    highlights: [
      "15-Year annual calendar track records across major fund houses",
      "Multi-dimensional scoring: Alpha, Beta, Risk Score & FE Crown ratings",
      "Interactive ISA & SIPP investment asset allocation builder",
      "Zero-dependency high-speed architecture with interactive charts"
    ],
    techStack: ["Python", "FE fundinfo Trustnet Data", "Chart.js", "Financial Mathematics"],
    batFile: "run_funds_advisor.bat",
    icon: "trending-up",
    accentColor: "from-emerald-600 to-teal-600",
    statLabel: "Historical Track Record",
    statValue: "15+ Years Calendar"
  },
  {
    id: "student-loan-calculator",
    title: "UK UniLoan & Parental Contribution Calculator",
    tagline: "Plan 2, Plan 5 & Postgrad Repayment & Opportunity Cost Lab",
    category: "FinTech & Wealth",
    badge: "UK Personal Finance",
    status: "Production Ready",
    port: 8060,
    localUrl: "http://127.0.0.1:8060",
    githubUrl: "https://github.com/anildutta007/uk-student-loan-calculator",
    summary: "The definitive England & Wales student loan lifetime simulator. Analyzes take-home payslips with Income Tax, NI, and student loans, models the Plan 2 vs Plan 5 marginal tax wedge, and compares early loan payoff against global equity index investing over 30 to 40 years.",
    highlights: [
      "Comprehensive Plan 2 (30-yr / £27,295) vs Plan 5 (40-yr / £25,000) simulation",
      "Salary sacrifice pension impact on student loan repayments",
      "Parental contribution vs Global Equity S&P/MSCI investment opportunity cost",
      "Lifetime balance write-off and total cost-to-graduate modeling"
    ],
    techStack: ["Python", "FastAPI", "Tailwind CSS", "Chart.js", "Pydantic"],
    batFile: "run_loan_calculator.bat",
    icon: "calculator",
    accentColor: "from-amber-600 to-orange-600",
    statLabel: "Simulation Horizon",
    statValue: "Up to 40 Years"
  },
  {
    id: "smart-fridge-planner",
    title: "SmartFridge AI — Meal & Pantry Planner",
    tagline: "Zero-Waste Household Food Optimization & Recipe Engine",
    category: "Lifestyle & AI",
    badge: "Smart Living",
    status: "Production Ready",
    port: 8050,
    localUrl: "http://127.0.0.1:8050",
    githubUrl: "https://github.com/anildutta007/smart-fridge-planner",
    summary: "An intelligent household culinary and inventory management platform. Tracks freshness dates of fridge and pantry staples, automatically suggests delicious recipes prioritized by expiring ingredients, generates smart shopping lists, and cuts grocery expenditure.",
    highlights: [
      "Dynamic fridge and pantry inventory tracking with expiry alerts",
      "Zero-waste recipe suggestion engine powered by available ingredients",
      "Automated consolidation of missing items into smart shopping lists",
      "Household grocery budget analytics saving up to £120/month per home"
    ],
    techStack: ["Python", "FastAPI", "Tailwind CSS", "JavaScript", "Uvicorn"],
    batFile: "run_fridge_planner.bat",
    icon: "refrigerator",
    accentColor: "from-purple-600 to-pink-600",
    statLabel: "Household Savings",
    statValue: "Up to £120/mo"
  }
];

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initClock();
  initEventListeners();
  loadData();
});

// Setup Dark/Light Mode
function initTheme() {
  const savedTheme = localStorage.getItem('ad_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('ad_theme', isDark ? 'dark' : 'light');
  lucide.createIcons();
}

// System Time Header
function initClock() {
  const timeElem = document.getElementById('system-time');
  function updateTime() {
    const now = new Date();
    if (timeElem) {
      timeElem.textContent = now.toLocaleDateString('en-GB', { 
        weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
      });
    }
  }
  updateTime();
  setInterval(updateTime, 30000);
}

// Fetch Data from Backend API or Fallbacks
async function loadData() {
  try {
    // 1. Fetch Apps
    const appsRes = await fetch('/api/apps').catch(() => null);
    if (appsRes && appsRes.ok) {
      const data = await appsRes.json();
      state.apps = data.apps || FALLBACK_APPS;
    } else {
      state.apps = FALLBACK_APPS;
    }

    // 2. Fetch Articles
    const articlesRes = await fetch('/api/articles').catch(() => null);
    if (articlesRes && articlesRes.ok) {
      const data = await articlesRes.json();
      state.articles = data.articles || [];
    } else {
      // Fetch static json file if api not mounted
      const staticArtRes = await fetch('./data/articles.json').catch(() => null);
      if (staticArtRes && staticArtRes.ok) {
        state.articles = await staticArtRes.json();
      }
    }

    // 3. Fetch Queries
    const queriesRes = await fetch('/api/queries').catch(() => null);
    if (queriesRes && queriesRes.ok) {
      const data = await queriesRes.json();
      state.queries = data.queries || [];
    } else {
      const staticQRes = await fetch('./data/queries.json').catch(() => null);
      if (staticQRes && staticQRes.ok) {
        state.queries = await staticQRes.json();
      }
    }

  } catch (err) {
    console.warn('Network fetch error, using stored data:', err);
    state.apps = FALLBACK_APPS;
  }

  renderApps();
  renderArticles();
  renderQueries();
  updateQueriesCount();
  lucide.createIcons();
}

// ================= RENDER APPS LAUNCHPAD =================
function renderApps() {
  const container = document.getElementById('apps-grid');
  if (!container) return;

  let filtered = state.apps;
  if (state.activeAppFilter !== 'All') {
    filtered = filtered.filter(a => a.category.toLowerCase().includes(state.activeAppFilter.toLowerCase()));
  }

  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.summary.toLowerCase().includes(q) ||
      a.highlights.some(h => h.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <i data-lucide="search-x" class="w-10 h-10 text-slate-400 mx-auto mb-3"></i>
        <p class="text-sm font-semibold text-slate-500">No applications matched your search criteria.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(app => {
    const isLive = app.isLocalRunning;
    const statusPill = isLive 
      ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
           <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
           Port ${app.port} Online
         </span>`
      : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
           Port ${app.port} Ready
         </span>`;

    return `
      <div class="app-card bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
        
        <!-- Top Banner Gradient Line -->
        <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${app.accentColor || 'from-brand-600 to-indigo-600'}"></div>

        <div>
          <!-- Header Bar -->
          <div class="flex items-center justify-between gap-3 mb-4">
            <div class="flex items-center space-x-2">
              <span class="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                ${app.badge || 'Web App'}
              </span>
              <span class="text-xs text-slate-400">•</span>
              <span class="text-xs font-medium text-slate-500">${app.category}</span>
            </div>
            ${statusPill}
          </div>

          <!-- Title & Tagline -->
          <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            ${app.title}
          </h3>
          <p class="text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400 mt-1 mb-3">
            ${app.tagline}
          </p>

          <!-- Summary -->
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 line-clamp-3">
            ${app.summary}
          </p>

          <!-- Highlight Bullets -->
          <div class="space-y-1.5 mb-6">
            ${app.highlights.slice(0, 3).map(h => `
              <div class="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0"></i>
                <span class="leading-tight">${h}</span>
              </div>
            `).join('')}
          </div>

          <!-- Tech stack tags -->
          <div class="flex flex-wrap gap-1.5 mb-6">
            ${app.techStack.map(t => `
              <span class="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/60">
                ${t}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Action Controls -->
        <div class="pt-5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center space-x-2">
            <button onclick="openAppModal('${app.id}')" class="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center space-x-1.5">
              <i data-lucide="info" class="w-3.5 h-3.5 text-slate-400"></i>
              <span>Guide & Architecture</span>
            </button>
            <a href="${app.githubUrl}" target="_blank" rel="noopener" class="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="GitHub Repository">
              <i data-lucide="github" class="w-4 h-4"></i>
            </a>
          </div>

          <a href="${app.localUrl}" target="_blank" rel="noopener" class="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/25 transition transform hover:-translate-y-0.5 flex items-center space-x-1.5">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            <span>Launch Web App</span>
          </a>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// ================= RENDER ARTICLES HUB =================
function renderArticles() {
  const container = document.getElementById('articles-grid');
  if (!container) return;

  let filtered = state.articles;
  if (state.activeArticleCategory !== 'All') {
    filtered = filtered.filter(a => a.category === state.activeArticleCategory);
  }

  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.summary.toLowerCase().includes(q) ||
      (a.tags && a.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <i data-lucide="file-question" class="w-10 h-10 text-slate-400 mx-auto mb-3"></i>
        <p class="text-sm font-semibold text-slate-500">No articles matched your criteria.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(art => {
    return `
      <div class="article-card bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between group">
        <div>
          <!-- Category & Read time -->
          <div class="flex items-center justify-between text-xs mb-3">
            <span class="px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ${art.category}
            </span>
            <span class="text-slate-400 font-medium">${art.readTime}</span>
          </div>

          <!-- Title -->
          <h3 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2 cursor-pointer" onclick="openArticleModal('${art.id}')">
            ${art.title}
          </h3>

          <!-- Subtitle / Summary -->
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
            ${art.summary}
          </p>
        </div>

        <div>
          <!-- Tags -->
          <div class="flex flex-wrap gap-1 mb-4">
            ${(art.tags || []).slice(0, 3).map(tag => `
              <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">#${tag}</span>
            `).join('')}
          </div>

          <!-- Bottom bar -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <div class="text-slate-400 font-medium">${art.date}</div>
            <button onclick="openArticleModal('${art.id}')" class="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
              <span>Read Guide</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// ================= RENDER HELP & Q&A BOARD =================
function renderQueries() {
  const container = document.getElementById('queries-feed');
  if (!container) return;

  let filtered = state.queries;
  if (state.activeQueryStatus !== 'All') {
    filtered = filtered.filter(q => q.status === state.activeQueryStatus);
  }

  if (state.searchQuery.trim()) {
    const term = state.searchQuery.toLowerCase();
    filtered = filtered.filter(q => 
      q.title.toLowerCase().includes(term) || 
      q.question.toLowerCase().includes(term) ||
      (q.answer && q.answer.toLowerCase().includes(term)) ||
      q.authorName.toLowerCase().includes(term)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <i data-lucide="help-circle" class="w-8 h-8 text-slate-400 mx-auto mb-2"></i>
        <p class="text-sm font-semibold text-slate-500">No community questions match this filter.</p>
        <p class="text-xs text-slate-400 mt-1">Be the first to post a financial or technical question using the form!</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(q => {
    const isAnswered = q.status === 'Answered';
    const statusBadge = isAnswered 
      ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
           <i data-lucide="check" class="w-3 h-3 mr-1 text-emerald-500"></i>
           Answered by Anil
         </span>`
      : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
           <i data-lucide="clock" class="w-3 h-3 mr-1 text-amber-500"></i>
           In Review / Researching
         </span>`;

    const adminAnswerButton = (!isAnswered && state.adminMode)
      ? `<button onclick="openAnswerModal('${q.id}')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-900 flex items-center space-x-1">
           <i data-lucide="edit-3" class="w-3 h-3"></i>
           <span>Answer Query</span>
         </button>`
      : '';

    const adminDeleteButton = state.adminMode
      ? `<button onclick="deleteQuery('${q.id}')" class="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10 transition" title="Delete Query">
           <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
         </button>`
      : '';

    const answerBox = isAnswered ? `
      <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 -mx-6 -mb-6 p-6 rounded-b-3xl border-t border-emerald-100 dark:border-emerald-900/30">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-extrabold">AD</div>
            <span class="text-xs font-bold text-slate-900 dark:text-white">${q.answeredBy || 'Anil Dutta'}</span>
            <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">Expert Answer</span>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">${formatDate(q.answeredAt)}</span>
        </div>
        <div class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          ${q.answer}
        </div>
      </div>
    ` : '';

    return `
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition">
        
        <!-- Header: Author, Category, Status -->
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">${escapeHtml(q.authorName)}</span>
            <span class="text-xs text-slate-400">•</span>
            <span class="text-xs text-slate-500">${escapeHtml(q.authorLocation || 'UK')}</span>
            <span class="text-xs text-slate-400">•</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${q.category}</span>
          </div>

          <div class="flex items-center space-x-2">
            ${statusBadge}
            ${adminAnswerButton}
            ${adminDeleteButton}
          </div>
        </div>

        <!-- Question Title -->
        <h4 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mb-2 leading-snug">
          ${escapeHtml(q.title)}
        </h4>

        <!-- Question Content -->
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
          ${escapeHtml(q.question)}
        </p>

        <!-- Upvote & Meta -->
        <div class="flex items-center justify-between text-xs text-slate-400 pt-2">
          <span>Asked on ${formatDate(q.submittedAt)}</span>
          <button onclick="upvoteQuery('${q.id}')" class="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition border border-slate-200/80 dark:border-slate-700/60">
            <i data-lucide="thumbs-up" class="w-3 h-3 text-brand-500"></i>
            <span class="font-bold text-[11px]">${q.upvotes || 0}</span>
          </button>
        </div>

        <!-- Anil's Answer Block -->
        ${answerBox}

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function updateQueriesCount() {
  const badge = document.getElementById('queries-count-badge');
  if (badge) {
    badge.textContent = state.queries.length;
  }
}

// ================= EVENT LISTENERS =================
function initEventListeners() {
  // Theme Toggle
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Admin Mode Toggle
  const adminToggle = document.getElementById('admin-mode-toggle');
  if (adminToggle) {
    adminToggle.addEventListener('click', () => {
      state.adminMode = !state.adminMode;
      const textElem = document.getElementById('admin-mode-text');
      const addArtBtn = document.getElementById('add-article-btn');
      if (state.adminMode) {
        textElem.textContent = 'Admin Mode: ACTIVE';
        adminToggle.classList.add('bg-amber-600', 'text-slate-950');
        if (addArtBtn) addArtBtn.classList.remove('hidden');
        showToast('Admin Mode Enabled: You can now answer pending queries directly!');
      } else {
        textElem.textContent = 'Anil Admin Mode';
        adminToggle.classList.remove('bg-amber-600', 'text-slate-950');
        if (addArtBtn) addArtBtn.classList.add('hidden');
        showToast('Admin Mode Disabled');
      }
      renderQueries();
    });
  }

  // App Filter Tabs
  document.querySelectorAll('.app-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.app-filter-btn').forEach(b => {
        b.className = 'app-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold transition bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700';
      });
      btn.className = 'app-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold transition bg-brand-600 text-white';
      state.activeAppFilter = btn.getAttribute('data-filter');
      renderApps();
    });
  });

  // Article Filter Tabs
  document.querySelectorAll('.article-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.article-cat-btn').forEach(b => {
        b.className = 'article-cat-btn px-3 py-1.5 rounded-lg text-xs font-bold transition bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700';
      });
      btn.className = 'article-cat-btn px-3 py-1.5 rounded-lg text-xs font-bold transition bg-emerald-600 text-white';
      state.activeArticleCategory = btn.getAttribute('data-cat');
      renderArticles();
    });
  });

  // Query Status Filters
  document.querySelectorAll('.query-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.query-status-btn').forEach(b => {
        b.className = 'query-status-btn px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition';
      });
      btn.className = 'query-status-btn px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition';
      state.activeQueryStatus = btn.getAttribute('data-status');
      renderQueries();
    });
  });

  // Global Search Input
  const searchInput = document.getElementById('global-search-input');
  const searchClear = document.getElementById('global-search-clear');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (searchClear) {
        if (state.searchQuery) {
          searchClear.classList.remove('hidden');
        } else {
          searchClear.classList.add('hidden');
        }
      }
      renderApps();
      renderArticles();
      renderQueries();
    });
  }
  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      searchClear.classList.add('hidden');
      renderApps();
      renderArticles();
      renderQueries();
    });
  }

  // Help Query Form Submission
  const queryForm = document.getElementById('help-query-form');
  if (queryForm) {
    queryForm.addEventListener('submit', handleQuerySubmission);
  }

  // Modals Close handlers
  const closeAppModalBtn = document.getElementById('close-app-modal');
  if (closeAppModalBtn) closeAppModalBtn.addEventListener('click', closeAppModal);

  const closeArtModalBtn = document.getElementById('close-article-modal');
  if (closeArtModalBtn) closeArtModalBtn.addEventListener('click', closeArticleModal);

  const closeAnsModalBtn = document.getElementById('close-answer-modal');
  if (closeAnsModalBtn) closeAnsModalBtn.addEventListener('click', closeAnswerModal);

  const cancelAnsModalBtn = document.getElementById('admin-cancel-answer');
  if (cancelAnsModalBtn) cancelAnsModalBtn.addEventListener('click', closeAnswerModal);

  const submitAnsModalBtn = document.getElementById('admin-submit-answer');
  if (submitAnsModalBtn) submitAnsModalBtn.addEventListener('click', handleAnswerSubmission);

  // Copy article link
  const copyArtBtn = document.getElementById('copy-article-link');
  if (copyArtBtn) {
    copyArtBtn.addEventListener('click', () => {
      if (navigator.clipboard && state.selectedArticle) {
        navigator.clipboard.writeText(window.location.origin + '#' + state.selectedArticle.id);
        showToast('Article link copied to clipboard!');
      }
    });
  }

  // Backdrop click to close modals
  window.addEventListener('click', (e) => {
    const appModal = document.getElementById('app-modal');
    const artModal = document.getElementById('article-modal');
    const ansModal = document.getElementById('answer-modal');
    if (e.target === appModal) closeAppModal();
    if (e.target === artModal) closeArticleModal();
    if (e.target === ansModal) closeAnswerModal();
  });
}

// ================= HELP QUERY SUBMISSION =================
async function handleQuerySubmission(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('submit-query-btn');
  const authorName = document.getElementById('query-author').value.trim();
  const authorLocation = document.getElementById('query-location').value.trim() || 'UK';
  const category = document.getElementById('query-category').value;
  const title = document.getElementById('query-title').value.trim();
  const question = document.getElementById('query-content').value.trim();

  if (!authorName || !title || !question) {
    showToast('Please fill in all required fields.');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="animate-spin mr-2">◌</span> Posting...`;
  }

  const payload = {
    authorName,
    authorLocation,
    category,
    title,
    question
  };

  try {
    const response = await fetch('/api/queries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      state.queries.unshift(data.query);
    } else {
      // Local fallback
      const localNewQuery = {
        id: 'q-' + Date.now(),
        authorName,
        authorLocation,
        category,
        title,
        question,
        status: 'In Review',
        submittedAt: new Date().toISOString(),
        answer: '',
        answeredAt: '',
        answeredBy: '',
        upvotes: 1
      };
      state.queries.unshift(localNewQuery);
    }

    renderQueries();
    updateQueriesCount();
    document.getElementById('help-query-form').reset();
    showToast('Your query was successfully posted to the HELP desk!');
  } catch (err) {
    console.error('Error posting query:', err);
    showToast('Query submitted locally!');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i data-lucide="send" class="w-4 h-4 mr-2"></i><span>Submit Query to Anil</span>`;
      lucide.createIcons();
    }
  }
}

// ================= UPVOTE QUERY =================
async function upvoteQuery(queryId) {
  const target = state.queries.find(q => q.id === queryId);
  if (!target) return;

  target.upvotes = (target.upvotes || 0) + 1;
  renderQueries();

  try {
    await fetch(`/api/queries/${queryId}/upvote`, { method: 'POST' });
  } catch (e) {
    // Offline / fallback
  }
}

// ================= DELETE QUERY =================
async function deleteQuery(queryId) {
  if (!confirm('Are you sure you want to delete this query?')) return;
  state.queries = state.queries.filter(q => q.id !== queryId);
  renderQueries();
  updateQueriesCount();

  try {
    await fetch(`/api/queries/${queryId}`, { method: 'DELETE' });
  } catch (e) {}
}

// ================= ADMIN ANSWER MODAL =================
function openAnswerModal(queryId) {
  const target = state.queries.find(q => q.id === queryId);
  if (!target) return;

  state.targetAnswerQueryId = queryId;
  document.getElementById('admin-target-query-title').textContent = target.title;
  document.getElementById('admin-target-query-question').textContent = target.question;
  document.getElementById('admin-answer-text').value = target.answer || '';

  const modal = document.getElementById('answer-modal');
  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeAnswerModal() {
  document.getElementById('answer-modal').classList.add('hidden');
  state.targetAnswerQueryId = null;
}

async function handleAnswerSubmission() {
  const answerText = document.getElementById('admin-answer-text').value.trim();
  if (!answerText) {
    showToast('Please type an answer before publishing.');
    return;
  }

  const queryId = state.targetAnswerQueryId;
  const target = state.queries.find(q => q.id === queryId);
  if (!target) return;

  target.answer = answerText;
  target.answeredBy = 'Anil Dutta';
  target.answeredAt = new Date().toISOString();
  target.status = 'Answered';

  try {
    await fetch(`/api/queries/${queryId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: answerText, answeredBy: 'Anil Dutta' })
    });
  } catch (e) {}

  closeAnswerModal();
  renderQueries();
  showToast('Answer published to the community board!');
}

// ================= APP DETAILS MODAL =================
function openAppModal(appId) {
  const app = state.apps.find(a => a.id === appId);
  if (!app) return;

  state.selectedApp = app;

  document.getElementById('modal-app-title').textContent = app.title;
  document.getElementById('modal-app-tagline').textContent = app.tagline;
  document.getElementById('modal-app-summary').textContent = app.summary;
  document.getElementById('modal-app-bat').textContent = `Command: ${app.batFile}`;
  document.getElementById('modal-app-port').textContent = `Port: ${app.port}`;
  document.getElementById('modal-app-launch').href = app.localUrl;
  document.getElementById('modal-app-github').href = app.githubUrl;

  const highlightsContainer = document.getElementById('modal-app-highlights');
  highlightsContainer.innerHTML = app.highlights.map(h => `
    <li class="flex items-start space-x-2">
      <i data-lucide="check-circle-2" class="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0"></i>
      <span>${h}</span>
    </li>
  `).join('');

  const techContainer = document.getElementById('modal-app-tech');
  techContainer.innerHTML = app.techStack.map(t => `
    <span class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
      ${t}
    </span>
  `).join('');

  const modal = document.getElementById('app-modal');
  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeAppModal() {
  document.getElementById('app-modal').classList.add('hidden');
  state.selectedApp = null;
}

// ================= ARTICLE READER MODAL =================
function openArticleModal(articleId) {
  const art = state.articles.find(a => a.id === articleId);
  if (!art) return;

  state.selectedArticle = art;

  document.getElementById('modal-article-category').textContent = art.category;
  document.getElementById('modal-article-readtime').textContent = art.readTime;
  document.getElementById('modal-article-title').textContent = art.title;
  document.getElementById('modal-article-author').textContent = art.author || 'Anil Dutta';
  document.getElementById('modal-article-date').textContent = art.date || 'October 2026';

  const bodyElem = document.getElementById('modal-article-body');
  bodyElem.innerHTML = renderMarkdown(art.content);

  const modal = document.getElementById('article-modal');
  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeArticleModal() {
  document.getElementById('article-modal').classList.add('hidden');
  state.selectedArticle = null;
}

// Simple fast markdown parser for clean article rendering
function renderMarkdown(md) {
  if (!md) return '';

  let html = md;

  // Tables
  html = html.replace(/\|(.+)\|[\r\n]+\|[-:| ]+\|[\r\n]+((?:\|.+[\r\n]*)+)/g, (match, header, rows) => {
    const headers = header.split('|').filter(h => h.trim()).map(h => `<th>${h.trim()}</th>`).join('');
    const rowLines = rows.trim().split('\n');
    const tableBody = rowLines.map(row => {
      const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<div class="overflow-x-auto my-4"><table><thead><tr>${headers}</tr></thead><tbody>${tableBody}</tbody></table></div>`;
  });

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');

  // Bold / Italics / Code
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(/`(.*?)`/gim, '<code>$1</code>');

  // Horizontal Rules
  html = html.replace(/---/gim, '<hr>');

  // Unordered Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  html = html.replace(/<\/ul>[\s\n]*<ul>/gim, '');

  // Ordered Lists
  html = html.replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>');

  // Paragraphs
  const blocks = html.split(/\n{2,}/);
  html = blocks.map(b => {
    b = b.trim();
    if (!b) return '';
    if (b.startsWith('<h') || b.startsWith('<ul') || b.startsWith('<ol') || b.startsWith('<div') || b.startsWith('<hr')) {
      return b;
    }
    return `<p>${b}</p>`;
  }).join('\n');

  return html;
}

// ================= TOAST NOTIFICATION =================
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.remove('hidden');
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hidden');
  }, 4000);
}

// Helpers
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return isoStr;
  }
}
