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
    id: "platform-advisor",
    title: "UK Investment Platform Advisor",
    tagline: "ISA, SIPP & Trading Account Fee Engine & Decision Advisor",
    category: "FinTech & Wealth",
    badge: "Platform Advisor",
    status: "Production Ready",
    port: 8070,
    liveUrl: "https://uk-platform-advisor.vercel.app/",
    localUrl: "http://127.0.0.1:8070",
    summary: "Impartial UK fee comparison and recommendation engine evaluating AJ Bell, Interactive Investor, Hargreaves Lansdown, Trading 212, Fidelity, and Vanguard across ISA, SIPP, and GIA accounts.",
    highlightsHeader: "Key Highlights:",
    highlights: [
      "**6 Major UK Platforms Compared:** Granular fee models for AJ Bell, ii, HL, Trading 212, Fidelity, and Vanguard.",
      "**Fee Crossover & Compounding Drag:** Live visual charts proving where flat fees beat percentage custody fees.",
      "**Employer SIPP & Overseas FX Rules:** Critical suitability logic flagging company pension contribution and FX constraints."
    ],
    techStack: ["Node.js / Python", "Tailwind CSS", "Chart.js", "Lucide Icons"],
    batFile: "run_platform_advisor.bat",
    icon: "compass",
    accentColor: "from-sky-600 to-blue-700",
    statLabel: "UK Platforms Evaluated",
    statValue: "6 Leading Providers"
  },
  {
    id: "student-loan-calculator",
    title: "UK University Fee & Student Loan Calculator",
    tagline: "Plan 2, Plan 5 & Should Parents Pay Tuition? Simulator",
    category: "FinTech & Wealth",
    badge: "University Finance",
    status: "Production Ready",
    port: 8060,
    liveUrl: "https://www.ukstudentloancalculator.co.uk/",
    localUrl: "http://127.0.0.1:8060",
    summary: "Simulates UK Plan 2 & Plan 5 university student loan repayments to determine whether paying tuition upfront or investing in an ISA is financially optimal.",
    highlightsHeader: "Key Highlights:",
    highlights: [
      "**9% Graduate Tax Model:** Simulates repayments strictly on earnings above salary thresholds (£25k/£29k).",
      "**£70,000+ ISA Deposit Alternative:** Compares upfront fee payments against long-term compounding for a home deposit.",
      "**Lifetime Debt Forgiveness:** Models total graduate repayments vs official write-off after 30 or 40 years."
    ],
    techStack: ["Python", "FastAPI", "Tailwind CSS", "Chart.js"],
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
    summary: "Institutional-grade UK fund screener and retirement calculator powered by FE fundinfo Trustnet 15-year annual performance data.",
    highlightsHeader: "Key Highlights:",
    highlights: [
      "**Risk-Rated Fund Screener:** Filter and rank top UK funds across Low, Medium, and High risk profiles.",
      "**Retirement Pot Runway:** Calculates how long savings last alongside the UK State Pension.",
      "**Inflation-Adjusted Target:** Projects real monthly savings goals calibrated to today's grocery prices."
    ],
    techStack: ["Python", "Trustnet Data", "Tailwind CSS", "Chart.js"],
    batFile: "run_funds_advisor.bat",
    icon: "trending-up",
    accentColor: "from-emerald-600 to-teal-600",
    statLabel: "Historical Track Record",
    statValue: "15+ Years Calendar"
  },
  {
    id: "stock-picker",
    title: "Global & UK Stock Picker",
    tagline: "FTSE, NASDAQ, Dow Jones & NIFTY 50 Intelligence Hub",
    category: "FinTech & Wealth",
    badge: "Stock Intelligence",
    status: "Production Ready",
    port: 8088,
    liveUrl: "https://uk-stock-picker.vercel.app",
    localUrl: "http://127.0.0.1:8088",
    summary: "Multi-market intelligence platform screening momentum breakouts, relative volume surges, and dividends across the UK, US, and India.",
    highlightsHeader: "Key Highlights:",
    highlights: [
      "**6 Market Universes:** Screens FTSE 100/250/350, NASDAQ 100, Dow Jones 30, and NIFTY 50 in real time.",
      "**Volume & Momentum Spikes:** Detects RVOL surges (>1.5x–3.0x), 52-week highs, and customizable movers.",
      "**Ex-Dividend Calendar & Ratings:** Purchase cutoff dates, dividend cash calculator, and Wall Street analyst targets."
    ],
    techStack: ["Python", "FastAPI", "Yahoo Finance Feed", "Chart.js"],
    batFile: "run_picker.bat",
    icon: "line-chart",
    accentColor: "from-cyan-600 to-blue-600",
    statLabel: "Market Coverage",
    statValue: "6 Global Indices"
  },
  {
    id: "magazine-share-tracker",
    title: "Magazine Share Tracker & AI Research Hub",
    tagline: "Investment Reading Companion, Broker Consensus & AI Agent Verdict",
    category: "FinTech & Wealth",
    badge: "Stock Research",
    status: "Production Ready",
    port: 8094,
    liveUrl: "https://magazine-share-tracker.vercel.app/",
    localUrl: "http://127.0.0.1:8094",
    summary: "Log shares discovered in investment magazines and newspapers with instant Sector, Exchange, Index membership, Major Broker Consensus, and AI buy/hold verdict.",
    highlightsHeader: "Key Highlights:",
    highlights: [
      "**Instant Ticker & Index Lookup:** Auto-retrieves Sector, Exchange, and Index membership across FTSE 100/250, AIM, and S&P 500.",
      "**Major Broker Consensus:** Pulls Wall Street & City broker Buy/Hold/Sell ratings, price targets, and market sentiment.",
      "**AI Research Agent Verdict:** Evaluates news catalysts and fundamentals to generate automated investment verdicts and summaries."
    ],
    techStack: ["JavaScript", "AI Research Agent", "Tailwind CSS", "Lucide Icons"],
    batFile: "run_magazine_tracker.bat",
    icon: "newspaper",
    accentColor: "from-rose-600 to-pink-600",
    statLabel: "Market Coverage",
    statValue: "UK, US & Global"
  },
  {
    id: "uk-passive-tracker-indexes",
    title: "UK Passive Tracker Indexes & Top 5 Alpha Funds",
    tagline: "12 UK-Investable Benchmarks & 20-Year Return Matrix vs 60 Alpha Funds",
    category: "FinTech & Wealth",
    badge: "Index & Alpha Lab",
    status: "Production Ready",
    port: 8096,
    liveUrl: "https://uk-passive-tracker-indexes.vercel.app/",
    localUrl: "http://127.0.0.1:8096",
    summary: "Comprehensive directory of 12 UK-investable passive tracker indexes comparing 20-year annual returns against 60 outperforming active funds and investment trusts.",
    highlightsHeader: "Key Highlights:",
    highlights: [
      "**12 UK Benchmark Indexes:** 20-year annual percentage returns (2006–2025 + 2026 YTD) across S&P 500, NASDAQ-100, FTSE, Global, and Tech.",
      "**Top 5 Outperforming Funds:** Ranks 60 index-beating active OEICs, investment trusts, and factor ETFs net of ongoing charges (OCF).",
      "**Cheapest Tracker Guide:** Recommends lowest-fee ISA/SIPP tracker funds and ETFs from Vanguard, iShares, Fidelity, HSBC, and Invesco."
    ],
    techStack: ["JavaScript", "Chart.js", "Tailwind CSS", "Lucide Icons"],
    batFile: "run_passive_trackers.bat",
    icon: "bar-chart-3",
    accentColor: "from-emerald-600 to-teal-700",
    statLabel: "Benchmark Indexes",
    statValue: "12 Indexes & 60 Funds"
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
    summary: "Compliance and audit management portal for UK Buy-to-Let landlords and letting agents under Housing Act 2004 Selective Licensing.",
    highlightsHeader: "Key Highlights:",
    highlights: [
      "**35-Condition Council Audit:** Comprehensive checklist covering fire safety, gas CP12, EICR, and space standards.",
      "**Instant Legal PDF Documents:** Produces 7 audit-ready inspection reports, statutory notices, and deeds.",
      "**Deadline & Penalty Alerts:** Tracks statutory 7/28/30-day compliance windows and civil penalty risks."
    ],
    techStack: ["JavaScript", "HTML5", "jsPDF", "Compliance Engine"],
    batFile: "run_local.bat",
    icon: "building-2",
    accentColor: "from-indigo-600 to-blue-600",
    statLabel: "Statutory Schedule",
    statValue: "35 Conditions"
  },
  {
    id: "zodiac-compatibility",
    title: "ZodiacMatch AI & Synastry Matrix",
    tagline: "Sun Sign, Birth Date & Linda Goodman Synastry Matrix",
    category: "Culture & Lifestyle",
    badge: "Astrology Synastry",
    status: "Production Ready",
    port: 8085,
    liveUrl: "https://zodiac-compatibility-three.vercel.app/",
    localUrl: "http://127.0.0.1:8085",
    summary: "Astrological synastry platform evaluating couples and singles using Linda Goodman harmonic vibrations and 6 deep compatibility dimensions.",
    highlightsHeader: "Key Highlights:",
    highlights: [
      "**6 Synastry Vectors:** Analyzes emotional harmony, physical chemistry, intellect, shared values, and conflict resolution.",
      "**Linda Goodman Harmonic Vibrations:** Models cosmic patterns (1-1 to 7-7), karmic lessons, and polar attraction.",
      "**12x12 Compatibility Matrix:** Color-coded Green-Amber-Red synastry spectrum with tailored marital advice."
    ],
    techStack: ["JavaScript", "HTML5", "Tailwind CSS", "Synastry Engine"],
    batFile: "run_zodiac_compatibility.bat",
    icon: "sparkles",
    accentColor: "from-purple-600 to-pink-600",
    statLabel: "Synastry Model",
    statValue: "12x12 Matrix"
  },
  {
    id: "world-news-map",
    title: "World News Map & Global Intelligence",
    tagline: "Interactive Cartographic News & Country Briefings",
    category: "News & Global",
    badge: "World Cartography",
    status: "Production Ready",
    port: 8092,
    liveUrl: "https://world-news-map-orpin.vercel.app/",
    localUrl: "http://127.0.0.1:8092",
    summary: "Interactive cartographic news platform allowing users to click any nation on a dynamic world map to inspect real-time regional developments.",
    highlightsHeader: "Key Highlights:",
    highlights: [
      "**Interactive Country Map:** Clickable vector world map powered by Leaflet with instant country profile detection.",
      "**5 Curated Verticals:** Real-time briefings across Economics, Business, Politics, Sports, and Culture.",
      "**Deep-Dive Country Briefings:** Detailed intelligence modals with sentiment indicators, key metrics, and source links."
    ],
    techStack: ["Python", "Leaflet.js", "GeoJSON", "Tailwind CSS"],
    batFile: "run_world_news.bat",
    icon: "globe",
    accentColor: "from-sky-600 to-indigo-600",
    statLabel: "Global Coverage",
    statValue: "190+ Countries"
  },
  {
    id: "seep-game",
    title: "SEEP (सीप) - Punjabi Card Game",
    tagline: "Authentic 4-Player North Indian Partnership Strategy",
    category: "Culture & Games",
    badge: "Card Strategy",
    status: "Production Ready",
    port: 8000,
    liveUrl: "https://seep-game-inky.vercel.app/",
    localUrl: "http://127.0.0.1:8000",
    summary: "Traditional 4-player Punjabi partnership card game played with a 52-card deck, featuring authentic bidding, house building, and 100-point Baazi matches.",
    highlightsHeader: "Key Highlights:",
    highlights: [
      "**Authentic Partnership Rules:** 2 vs 2 strategy tracking point cards: Spades (1 pt), Aces (1 pt), and 10 of Diamonds (6 pts).",
      "**House Building & Sweeps:** Build and pick up houses (9–12), cement builds with pairs, and score 50-point Seep sweeps.",
      "**Intelligent AI Engine:** Play with and against smart AI partners with automated turn flow and sound effects."
    ],
    techStack: ["JavaScript", "HTML5 Canvas", "Web Audio API", "Card Engine"],
    batFile: "run_seep_game.bat",
    icon: "gamepad-2",
    accentColor: "from-amber-600 to-red-600",
    statLabel: "Match Format",
    statValue: "100-Pt Baazi"
  },
  {
    id: "interval-reminder",
    title: "PulseRemind - Interval Alarms & Habits Hub",
    tagline: "Multilingual Voice Alarms, 37 Curated AI Tools & Indian Markets",
    category: "Productivity & Tools",
    badge: "Productivity Lab",
    status: "Production Ready",
    port: 8050,
    liveUrl: "https://interval-reminder-app.vercel.app/",
    localUrl: "http://127.0.0.1:8050",
    summary: "Automated recurring interval alarm and habit tracker with natural spoken voice reminders in English, Hindi, and Punjabi, alongside a 37-tool AI directory.",
    highlightsHeader: "Key Highlights:",
    highlights: [
      "**Multilingual Voice Alarms:** Spoken interval alarms in English, Hindi (हिंदी), and Punjabi (ਪੰਜਾਬੀ) with customizable repeat frequencies.",
      "**37 Curated AI Tools Suite:** Hand-picked master directory categorized across productivity, design, coding, research, and video generation.",
      "**Indian Market Watch & Profiles:** Live tracking of 16 broad market and sectoral indices with multi-user profiles and celebration confetti."
    ],
    techStack: ["JavaScript", "HTML5", "Web Speech API", "Tailwind CSS"],
    batFile: "run_reminder.bat",
    icon: "timer",
    accentColor: "from-teal-600 to-sky-600",
    statLabel: "Spoken Languages",
    statValue: "EN, HI & PA"
  },
  {
    id: "trip-expense-splitter",
    title: "Dosti Pakki Expense Apna Apna",
    tagline: "Group Trip Expense Splitter & AI Receipt Scanner",
    category: "Productivity & Tools",
    badge: "Group Expenses",
    status: "Production Ready",
    port: 8080,
    liveUrl: "https://trip-expense-splitter-theta.vercel.app/",
    localUrl: "http://127.0.0.1:8080",
    summary: "Smart group trip expense splitter featuring camera snapshot capture, AI receipt scanning, fewest-payment debt settlement, and CSV spreadsheet export.",
    highlightsHeader: "Key Highlights:",
    highlights: [
      "**Fewest-Payment Settle-Up:** Minimizes transaction count so friends settle balances with the least possible number of transfers.",
      "**AI Receipt Scanner:** Extracts bill totals, vendor descriptions, categories, and dates from photos and PDFs automatically.",
      "**Multi-Member Split & CSV Export:** Customizable unequal/equal splits, camera snapshot uploads, and one-click spreadsheet download."
    ],
    techStack: ["JavaScript", "Node.js / Python", "Gemini Vision AI", "Tailwind CSS"],
    batFile: "run_trip_splitter.bat",
    icon: "receipt",
    accentColor: "from-violet-600 to-indigo-600",
    statLabel: "Settlement Algorithm",
    statValue: "Fewest Transfers"
  }
];

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initClock();
  initVisitorCounter();
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

// Live Visitor Counter
async function initVisitorCounter() {
  const countEl = document.getElementById('visitor-count');
  const mobileCountEl = document.getElementById('mobile-visitor-count');
  if (!countEl && !mobileCountEl) return;

  const CACHE_KEY = 'ad_site_visitors_cache';
  const LAST_VISIT_KEY = 'ad_last_visit_timestamp';
  const BASE_OFFSET = 120; // Baseline visits prior to counter deployment
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  function updateDisplay(num) {
    const formatted = Number(num).toLocaleString('en-GB');
    if (countEl) countEl.textContent = formatted;
    if (mobileCountEl) mobileCountEl.textContent = formatted;
  }

  // Restore cached value immediately to avoid blank flash
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    updateDisplay(parseInt(cached, 10));
  }

  // Increment once per user per 24 hours
  const lastVisit = parseInt(localStorage.getItem(LAST_VISIT_KEY) || '0', 10);
  const isNewVisit = !lastVisit || (now - lastVisit > ONE_DAY_MS);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = isNewVisit
      ? 'https://counterapi.com/api/dutta-webapps.com/view/site-visits'
      : 'https://counterapi.com/api/dutta-webapps.com/view/site-visits?readOnly=true';

    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.value === 'number') {
        const totalCount = data.value + BASE_OFFSET;
        localStorage.setItem(CACHE_KEY, totalCount.toString());
        localStorage.setItem(LAST_VISIT_KEY, now.toString());
        updateDisplay(totalCount);
        return;
      }
    }
  } catch (err) {
    console.warn('Visitor counter API unreachable, using local fallback:', err);
  }

  // Graceful fallback if external API is unreachable or blocked
  let fallbackCount = cached ? parseInt(cached, 10) : BASE_OFFSET + 1;
  if (isNewVisit && cached) {
    fallbackCount += 1;
    localStorage.setItem(LAST_VISIT_KEY, now.toString());
  }
  localStorage.setItem(CACHE_KEY, fallbackCount.toString());
  updateDisplay(fallbackCount);
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
      <div class="app-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 flex flex-col justify-between relative overflow-hidden group shadow-xs hover:shadow-xl transition-all duration-300">
        
        <!-- Top Banner Gradient Line -->
        <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${app.accentColor || 'from-brand-600 to-indigo-600'}"></div>

        <div>
          <!-- Header Bar -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <div class="flex items-center space-x-1.5">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                ${app.badge || 'Web App'}
              </span>
              <span class="text-xs text-slate-400">•</span>
              <span class="text-[11px] font-medium text-slate-500">${app.category}</span>
            </div>
            ${statusPill}
          </div>

          <!-- Title & Tagline -->
          <h3 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            ${app.title}
          </h3>
          <p class="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-0.5 mb-2.5">
            ${app.tagline}
          </p>

          <!-- Live Web App URL Display -->
          ${app.liveUrl ? `
            <div class="mb-3">
              <a href="${app.liveUrl}" target="_blank" rel="noopener" class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:underline transition border border-slate-200/80 dark:border-slate-700/60 shadow-2xs" title="Visit Live Web Application">
                <i data-lucide="globe" class="w-3 h-3 text-emerald-500"></i>
                <span class="truncate max-w-[200px]">${app.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                <i data-lucide="arrow-up-right" class="w-3 h-3 text-slate-400"></i>
              </a>
            </div>
          ` : ''}

          <!-- Summary -->
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            ${app.summary}
          </p>

          <!-- Highlights Header (if any) -->
          ${app.highlightsHeader ? `
            <div class="text-[10.5px] font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-2 flex items-center space-x-1.5">
              <i data-lucide="zap" class="w-3 h-3 text-amber-500"></i>
              <span>${app.highlightsHeader}</span>
            </div>
          ` : ''}

          <!-- Highlight Bullets -->
          <div class="space-y-1.5 mb-3.5">
            ${app.highlights.map(h => {
              const formattedH = h.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white font-semibold">$1</strong>');
              return `
                <div class="flex items-start space-x-1.5 text-[11px] text-slate-700 dark:text-slate-300 leading-normal">
                  <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0"></i>
                  <span>${formattedH}</span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Tech stack tags -->
          <div class="flex flex-wrap gap-1 mb-4">
            ${app.techStack.map(t => `
              <span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/60">
                ${t}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Action Controls -->
        <div class="pt-3.5 border-t border-slate-100 dark:border-slate-800/80">
          <a href="${app.liveUrl || app.localUrl}" target="_blank" rel="noopener" onclick="trackEvent('launch_app', { app_id: '${app.id}' })" class="w-full justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-sm shadow-brand-600/25 transition transform hover:-translate-y-0.5 flex items-center space-x-2 text-center">
            <span>Launch Web App</span>
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          </a>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// ================= ANALYTICS EVENT TRACKING =================
function trackEvent(eventName, eventParams = {}) {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
    }
  } catch (e) {
    // Silently continue if analytics is blocked
  }
}
window.trackEvent = trackEvent;

// ================= LEGAL MODAL CONTROLS =================
function openLegalModal() {
  trackEvent('open_legal_modal');
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

// ================= SUPPORT THE DEVELOPER (MONZO PAY) CONTROLS =================
let currentTipAmount = 1;
const MONZO_USERNAME = 'anildutta';

function selectTipAmount(amount) {
  currentTipAmount = amount === 2 ? 2 : 1;
  const btn1 = document.getElementById('tip-btn-1');
  const btn2 = document.getElementById('tip-btn-2');
  const monzoBtn = document.getElementById('tip-monzo-btn');
  const displayAmount = document.getElementById('tip-display-amount');

  if (btn1 && btn2) {
    if (currentTipAmount === 1) {
      btn1.className = 'tip-chip p-3.5 rounded-2xl border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition cursor-pointer shadow-xs';
      btn2.className = 'tip-chip p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition cursor-pointer';
    } else {
      btn1.className = 'tip-chip p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition cursor-pointer';
      btn2.className = 'tip-chip p-3.5 rounded-2xl border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition cursor-pointer shadow-xs';
    }
  }

  if (displayAmount) {
    displayAmount.textContent = `£${currentTipAmount}.00`;
  }

  if (monzoBtn) {
    const note = encodeURIComponent('Support Anil Dutta Web Apps');
    monzoBtn.href = `https://monzo.me/${MONZO_USERNAME}/${currentTipAmount}?d=${note}`;
  }
}

function openTipModal() {
  trackEvent('open_tip_modal');
  const modal = document.getElementById('tip-modal');
  if (modal) {
    selectTipAmount(1); // Default to £1
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
  }
}

function closeTipModal() {
  const modal = document.getElementById('tip-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Expose tip functions globally for HTML onclick handlers
window.openTipModal = openTipModal;
window.closeTipModal = closeTipModal;
window.selectTipAmount = selectTipAmount;

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

  // Modals Backdrop & Keyboard handling
  window.addEventListener('click', (e) => {
    const legalModal = document.getElementById('legal-modal');
    if (legalModal && e.target === legalModal) {
      closeLegalModal();
    }
    const tipModal = document.getElementById('tip-modal');
    if (tipModal && e.target === tipModal) {
      closeTipModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLegalModal();
      closeTipModal();
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
