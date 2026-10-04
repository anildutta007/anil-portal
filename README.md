# Anil Dutta | FinTech & AI Web Apps Lab, Articles Hub & HELP Desk

An executive digital workbench and launchpad uniting all web applications built by **Anil Dutta** in one place, featuring an editorial library of UK financial and technical articles, plus an interactive community **HELP Desk** where visitors post queries and receive direct answers from Anil.

---

## 🌟 Ecosystem Overview

1. **Web Apps Launchpad**:
   - **UK University Fee & Student Loan Calculator** (Port 8060): England & Wales student loan lifetime simulator (Plan 2 vs Plan 5), marginal tax wedge breakdown, and parent opportunity cost modeling.
   - **Dutta UK Funds Selection Advisor** (Port 8080): Institutional Trustnet FE fundinfo analyzer with 15-year annual calendar returns, Alpha, FE Crown ratings, and ISA/SIPP modeling.
   - **UK Landlord & Tenant Compliance Hub** (Port 8070): Specialized compliance portal for Selective Licensing (Housing Act 2004 Part 3), council 35-condition checklist audits, occupancy standards, and downloadable legal PDF documents.

2. **Articles & Insights (Knowledge Base)**:
   - Deep-dive guides compiled by Anil on UK tax structures, student loans, SIPP vs ISA mathematics, 15-year fund alpha persistence, and cost-optimized AI agent architecture.
   - Built-in distraction-free article reader with markdown tables and key takeaways.

3. **HELP Desk (Community Q&A Desk)**:
   - Visitors submit technical or financial queries.
   - Live public board displaying submitted questions with status tracking (`In Review` vs `Answered by Anil`).
   - Integrated **Anil Admin Mode** toggle allowing Anil to answer pending questions directly from the web browser.
   - Persistent storage in `data/queries.json` with local fallback.

---

## 🚀 Quick Start

### 1. Launch the Portal (Port 8090)
Double-click `run_portal.bat` in the project root or in `anil-portal`, or run:

```bash
cd "c:\Anil Google Projects\anil-portal"
python server.py
```

Your browser will automatically open at:
**`http://127.0.0.1:8090`**

### 2. Standalone Browser Access
If Python is not running, you can also open `anil-portal/static/index.html` directly in any modern web browser.

---

## 🛠 Project Structure

```text
c:\Anil Google Projects\
├── run_portal.bat                    <- 1-Click root launcher for master portal
├── anil-portal/
│   ├── api/
│   │   └── index.py                  <- Vercel serverless entry point
│   ├── data/
│   │   ├── apps.json                 <- Application catalog & launch metadata
│   │   ├── articles.json             <- Compiled articles & guides
│   │   └── queries.json              <- Community Q&A questions & answers
│   ├── static/
│   │   ├── index.html                <- Modern responsive single-page portal
│   │   ├── styles.css                <- Custom styles & markdown typography
│   │   └── app.js                    <- Reactive state, filters & API handling
│   ├── server.py                     <- FastAPI backend server (Port 8090)
│   ├── requirements.txt              <- Dependencies (fastapi, uvicorn, pydantic)
│   ├── run_portal.bat                <- Local launch script
│   └── vercel.json                   <- Vercel deployment configuration
```

---

## ✍️ How to Add New Apps & Articles

### Adding a New Web App:
Simply open `anil-portal/data/apps.json` and append a new JSON object with your app's title, port, description, and highlights. The portal will automatically display your new app card and check its live port health.

### Adding a New Article:
Open `anil-portal/data/articles.json` and append your article markdown content, or enable **Anil Admin Mode** in the header to draft and publish articles directly!

### Answering Help Queries:
Click **Anil Admin Mode** in the top navigation bar. Pending queries will display an **"Answer Query"** button. Type your answer and click **"Publish Answer"** to immediately update the live board.

---

## 🌐 Deploy to Vercel

This repository is pre-configured for Vercel deployment:
1. Push `anil-portal` to GitHub.
2. Link the repository in your [Vercel Dashboard](https://vercel.com).
3. Vercel automatically deploys the frontend and serverless API endpoints using `vercel.json`.
