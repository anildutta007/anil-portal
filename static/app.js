/**
 * Anil Dutta - Web Applications Launchpad
 * Client-Side Application Logic
 */

// Application State
const state = {
  apps: [],
  activeAppFilter: 'All',
  searchQuery: ''
};

// Fallback data in case server API is offline or loaded via file:// protocol
const FALLBACK_APPS = [
  {
    id: "student-loan-calculator",
    title: "UK University Fee & Student Loan Calculator",
    tagline: "Plan 2, Plan 5 & Postgrad Repayment & Opportunity Cost Lab",
    category: "FinTech & Wealth",
    badge: "University Finance",
    status: "Production Ready",
    port: 8060,
    liveUrl: "https://www.ukstudentloancalculator.co.uk/",
    localUrl: "http://127.0.0.1:8060",
    githubUrl: "https://github.com/anildutta007/uk-student-loan-calculator",
    summary: "The definitive England & Wales student loan lifetime simulator. Analyzes take-home payslips with Income Tax, NI, and student loans, models the Plan 2 vs Plan 5 marginal tax wedge, and compares early loan payoff against global equity index investing over 30 to 40 years.",
    highlights: [
      "**Actual Monthly Payslip Impact:** Breaks down your gross salary into Income Tax, National Insurance (8%), Student Loan (9%), and your exact net monthly take-home pay.",
      "**Plan 2 vs Plan 5:** Covers course start dates (Pre-Aug 2023 vs Post-Aug 2023 for England, and Wales staying on Plan 2), writing off after 30 vs 40 years.",
      "**Updated for 2026/27 GOV.UK figures:** Uses the current £29,385 Plan 2 threshold, £25k Plan 5 threshold, £21k Postgraduate threshold, and the official 4.1% interest / 6.0% caps.",
      "**Lifetime 30- & 40-Year Projection:** Tracks whether you actually clear the debt or have it wiped by the government, plus a full year-by-year breakdown with CSV export.",
      "**The 'Should Parents Pay Tuition?' Simulator:** Many parents consider paying £9,250/yr tuition upfront. The calculator compares paying fees vs investing the same money in an ISA at 3%, 4%, and 5% compound growth. (In many typical graduate career paths, paying tuition upfront saves £0 in student monthly deductions and simply hands cash to HMRC because the loan gets cancelled anyway)."
    ],
    techStack: ["Python", "FastAPI", "Tailwind CSS", "Chart.js", "Pydantic"],
    batFile: "run_loan_calculator.bat",
    icon: "calculator",
    accentColor: "from-amber-600 to-orange-600",
    statLabel: "Simulation Horizon",
    statValue: "Up to 40 Years"
  },
  {
    id: "funds-advisor",
    title: "Dutta UK Funds Selection Advisor",
    tagline: "Institutional Trustnet 15-Year Performance Universe",
    category: "FinTech & Wealth",
    badge: "FinTech Lab",
    status: "Production Ready",
    port: 8080,
    liveUrl: "https://uk-funds-advisor.vercel.app/",
    localUrl: "http://127.0.0.1:8080",
    githubUrl: "https://github.com/anildutta007/uk-funds-advisor",
    summary: "Institutional-grade UK fund screener powered by FE fundinfo Trustnet multi-house data with 15-year annual calendar returns.",
    highlightsHeader: "What it tells you in 30 seconds:",
    highlights: [
      "Which top UK funds to pick (Low, Medium, or High risk)",
      "How much money you need to retire comfortably",
      "How much to save each month to hit your goal",
      "How many years your pension pot will last (including your UK State Pension)",
      "Shows everything in today's real grocery prices, so inflation doesn't fool you!"
    ],
    techStack: ["Python", "FE fundinfo Trustnet Data", "Chart.js", "Financial Mathematics"],
    batFile: "run_funds_advisor.bat",
    icon: "trending-up",
    accentColor: "from-emerald-600 to-teal-600",
    statLabel: "Historical Track Record",
    statValue: "15+ Years Calendar"
  },
  {
    id: "landlord-licensing",
    title: "UK Landlord & Tenant Compliance Hub",
    tagline: "Selective Licensing, HMO Standards & Statutory Legal Notices",
    category: "Property & Legal",
    badge: "Property Compliance",
    status: "Production Ready",
    port: 8070,
    liveUrl: "https://uk-landlord-licensing.vercel.app",
    localUrl: "http://127.0.0.1:8070",
    githubUrl: "https://github.com/anildutta007/uk-landlord-licensing",
    summary: "A professional compliance and audit management portal for UK Buy-to-Let landlords, tenants, and letting agents. Built to manage Selective Licensing (Housing Act 2004 Part 3), council 35-condition checklist audits, occupancy limits, ASB warnings, and instant generation of official legal PDF documents.",
    highlights: [
      "**35-Condition Master Statutory Council Checklist Tracker:** Comprehensive audit coverage across fire safety, EICR, gas CP12, and space standards.",
      "**Instant Downloadable Legal PDF Documents:** Generates 7 official audit-ready documents (Inspections, ASB notices, Deeds of consent).",
      "**Multi-Council Preset Switcher:** Pre-configured for London Borough of Redbridge, Newham, and generic England & Wales Housing Act benchmarks.",
      "**Statutory Deadline & Penalty Calculator:** Tracks 7-day, 28-day, and 30-day compliance windows with £30,000 civil penalty risk modeling."
    ],
    techStack: ["JavaScript", "HTML5 / Tailwind CSS", "jsPDF", "Legal Document Engine"],
    batFile: "run_local.bat",
    icon: "building-2",
    accentColor: "from-indigo-600 to-blue-600",
    statLabel: "Statutory Schedule",
    statValue: "35 Conditions"
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
    const appsRes = await fetch('/api/apps').catch(() => null);
    if (appsRes && appsRes.ok) {
      const data = await appsRes.json();
      state.apps = (data.apps && data.apps.length > 0) ? data.apps : FALLBACK_APPS;
    } else {
      const staticRes = await fetch('./data/apps.json').catch(() => null);
      if (staticRes && staticRes.ok) {
        state.apps = await staticRes.json();
      } else {
        state.apps = FALLBACK_APPS;
      }
    }
  } catch (err) {
    console.warn('Network fetch error, using fallback data:', err);
    state.apps = FALLBACK_APPS;
  }

  renderApps();
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
      <div class="app-card bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300">
        
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
          <p class="text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400 mt-1 mb-2">
            ${app.tagline}
          </p>

          <!-- Live Web App URL Display -->
          ${app.liveUrl ? `
            <div class="mb-4">
              <a href="${app.liveUrl}" target="_blank" rel="noopener" class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:underline transition border border-slate-200/80 dark:border-slate-700/60 shadow-xs" title="Visit Live Web Application">
                <i data-lucide="globe" class="w-3.5 h-3.5 text-emerald-500"></i>
                <span>${app.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                <i data-lucide="arrow-up-right" class="w-3 h-3 text-slate-400"></i>
              </a>
            </div>
          ` : ''}

          <!-- Summary -->
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
            ${app.summary}
          </p>

          <!-- Highlights Header (if any) -->
          ${app.highlightsHeader ? `
            <div class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-2.5 flex items-center space-x-1.5">
              <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-500"></i>
              <span>${app.highlightsHeader}</span>
            </div>
          ` : ''}

          <!-- Highlight Bullets -->
          <div class="space-y-2.5 mb-6">
            ${app.highlights.map(h => {
              const formattedH = h.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white font-bold">$1</strong>');
              return `
                <div class="flex items-start space-x-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                  <i data-lucide="check-circle" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0"></i>
                  <span>${formattedH}</span>
                </div>
              `;
            }).join('')}
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
        <div class="pt-5 border-t border-slate-100 dark:border-slate-800/80">
          <div class="flex items-center justify-between gap-3">
            <a href="${app.githubUrl}" target="_blank" rel="noopener" class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center space-x-1.5" title="View Source on GitHub">
              <i data-lucide="github" class="w-4 h-4"></i>
              <span>GitHub</span>
            </a>

            <a href="${app.liveUrl || app.localUrl}" target="_blank" rel="noopener" class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/25 transition transform hover:-translate-y-0.5 flex items-center space-x-1.5">
              <i data-lucide="external-link" class="w-4 h-4"></i>
              <span>Launch Web App</span>
            </a>
          </div>
          <div class="mt-3 pt-2 border-t border-dashed border-slate-100 dark:border-slate-800/60 flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            <i data-lucide="shield-alert" class="w-3 h-3 text-amber-500/80"></i>
            <span>Educational simulation only • Zero professional liability</span>
          </div>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// ================= LEGAL MODAL CONTROLS =================
function openLegalModal() {
  const modal = document.getElementById('legal-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
  }
}

function closeLegalModal() {
  const modal = document.getElementById('legal-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Expose functions globally for HTML onclick handlers
window.openLegalModal = openLegalModal;
window.closeLegalModal = closeLegalModal;

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

  // Legal Modal Backdrop & Keyboard handling
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('legal-modal');
    if (modal && e.target === modal) {
      closeLegalModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLegalModal();
    }
  });

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
    });
  }
  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      searchClear.classList.add('hidden');
      renderApps();
    });
  }
}
