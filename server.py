"""
Anil Dutta - Digital Web-Apps & Financial Insights Hub
Master Portfolio, Web Apps Launchpad, Articles Hub & Q&A Help Desk Server
Runs on FastAPI / Uvicorn (Port 8090)
"""

import os
import json
import socket
import webbrowser
import threading
from typing import List, Optional, Dict, Any
from datetime import datetime

from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
STATIC_DIR = os.path.join(BASE_DIR, "static")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(STATIC_DIR, exist_ok=True)

app = FastAPI(
    title="Anil Dutta - Web Apps & Insights Hub",
    description="Portfolio launchpad, curated financial & tech articles, and community Help desk.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper functions for data loading & saving
IS_VERCEL = os.environ.get("VERCEL") == "1"

def load_json_data(filename: str, default_val: Any) -> Any:
    file_path = os.path.join(DATA_DIR, filename)
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[WARN] Error reading {filename}: {e}")
            return default_val
    return default_val

def save_json_data(filename: str, data: Any):
    try:
        file_path = os.path.join(DATA_DIR, filename)
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[WARN] Could not write {filename} (read-only filesystem on Vercel): {e}")

def check_port_open(port: int, host: str = "127.0.0.1", timeout: float = 0.3) -> bool:
    if IS_VERCEL:
        return False
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(timeout)
            result = s.connect_ex((host, port))
            return result == 0
    except Exception:
        return False
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(timeout)
            result = s.connect_ex((host, port))
            return result == 0
    except Exception:
        return False

# Pydantic Schemas
class QuerySubmission(BaseModel):
    authorName: str = Field(..., min_length=2, max_length=60)
    authorLocation: Optional[str] = Field("UK", max_length=60)
    category: str = Field(..., max_length=50)
    title: str = Field(..., min_length=5, max_length=150)
    question: str = Field(..., min_length=10, max_length=3000)

class QueryAnswerSubmission(BaseModel):
    answer: str = Field(..., min_length=5, max_length=5000)
    answeredBy: Optional[str] = Field("Anil Dutta", max_length=60)
    adminPin: Optional[str] = None

class ArticleSubmission(BaseModel):
    title: str = Field(..., min_length=5)
    subtitle: Optional[str] = ""
    category: str = Field(...)
    tags: List[str] = Field(default_factory=list)
    readTime: str = Field("5 min read")
    summary: str = Field(...)
    content: str = Field(...)
    featured: bool = False

# API Routes
@app.get("/api/apps")
async def get_apps():
    """Return all web applications with live local port health status."""
    apps_data = load_json_data("apps.json", [])
    
    # Check port health in real time
    for item in apps_data:
        port = item.get("port")
        if port:
            is_live = check_port_open(port)
            item["isLocalRunning"] = is_live
        else:
            item["isLocalRunning"] = False
            
    return {"apps": apps_data}

@app.get("/api/articles")
async def get_articles():
    """Return all curated articles."""
    articles = load_json_data("articles.json", [])
    return {"articles": articles}

@app.get("/api/articles/{article_id}")
async def get_article(article_id: str):
    articles = load_json_data("articles.json", [])
    for a in articles:
        if a.get("id") == article_id:
            return {"article": a}
    raise HTTPException(status_code=404, detail="Article not found")

@app.post("/api/articles")
async def create_article(art: ArticleSubmission):
    articles = load_json_data("articles.json", [])
    article_id = art.title.lower().replace(" ", "-").replace(":", "").replace("?", "")[:40]
    
    new_art = {
        "id": article_id,
        "title": art.title,
        "subtitle": art.subtitle,
        "category": art.category,
        "tags": art.tags,
        "readTime": art.readTime,
        "date": datetime.now().strftime("%B %Y"),
        "author": "Anil Dutta",
        "summary": art.summary,
        "content": art.content,
        "featured": art.featured
    }
    
    articles.insert(0, new_art)
    save_json_data("articles.json", articles)
    return {"success": True, "article": new_art}

@app.get("/api/queries")
async def get_queries(category: Optional[str] = None, status: Optional[str] = None):
    """Return all Q&A help queries."""
    queries = load_json_data("queries.json", [])
    if category and category != "All":
        queries = [q for q in queries if q.get("category") == category]
    if status and status != "All":
        queries = [q for q in queries if q.get("status") == status]
        
    return {"queries": queries}

@app.post("/api/queries")
async def submit_query(submission: QuerySubmission):
    """Visitor submits a new query to the HELP desk."""
    queries = load_json_data("queries.json", [])
    new_id = f"q-{int(datetime.now().timestamp())}"
    
    new_query = {
        "id": new_id,
        "authorName": submission.authorName.strip(),
        "authorLocation": submission.authorLocation.strip() if submission.authorLocation else "UK",
        "category": submission.category,
        "title": submission.title.strip(),
        "question": submission.question.strip(),
        "status": "In Review",
        "submittedAt": datetime.now().isoformat() + "Z",
        "answer": "",
        "answeredAt": "",
        "answeredBy": "",
        "upvotes": 1
    }
    
    # Place new questions at the top of the feed
    queries.insert(0, new_query)
    save_json_data("queries.json", queries)
    
    return {"success": True, "query": new_query}

@app.post("/api/queries/{query_id}/answer")
async def answer_query(query_id: str, payload: QueryAnswerSubmission):
    """Anil provides an answer to an existing query."""
    queries = load_json_data("queries.json", [])
    found = False
    updated_query = None
    
    for q in queries:
        if q.get("id") == query_id:
            q["answer"] = payload.answer.strip()
            q["answeredBy"] = payload.answeredBy or "Anil Dutta"
            q["answeredAt"] = datetime.now().isoformat() + "Z"
            q["status"] = "Answered"
            found = True
            updated_query = q
            break
            
    if not found:
        raise HTTPException(status_code=404, detail="Query not found")
        
    save_json_data("queries.json", queries)
    return {"success": True, "query": updated_query}

@app.post("/api/queries/{query_id}/upvote")
async def upvote_query(query_id: str):
    """Upvote a helpful query or answer."""
    queries = load_json_data("queries.json", [])
    for q in queries:
        if q.get("id") == query_id:
            q["upvotes"] = q.get("upvotes", 0) + 1
            save_json_data("queries.json", queries)
            return {"success": True, "upvotes": q["upvotes"]}
    raise HTTPException(status_code=404, detail="Query not found")

@app.delete("/api/queries/{query_id}")
async def delete_query(query_id: str):
    """Delete a query."""
    queries = load_json_data("queries.json", [])
    queries = [q for q in queries if q.get("id") != query_id]
    save_json_data("queries.json", queries)
    return {"success": True}

def resolve_file(rel_path: str) -> Optional[str]:
    candidate = os.path.join(BASE_DIR, rel_path)
    if os.path.exists(candidate) and os.path.isfile(candidate):
        return candidate
    candidate = os.path.join(STATIC_DIR, rel_path)
    if os.path.exists(candidate) and os.path.isfile(candidate):
        return candidate
    return None

@app.get("/")
async def serve_index():
    path = resolve_file("index.html")
    if path:
        return FileResponse(path)
    return JSONResponse({"message": "Anil Dutta Hub API Ready."})

@app.get("/{full_path:path}")
async def serve_static(full_path: str):
    path = resolve_file(full_path)
    if path:
        return FileResponse(path)
    index_path = resolve_file("index.html")
    if index_path:
        return FileResponse(index_path)
    raise HTTPException(status_code=404, detail="Page not found")

def open_browser():
    try:
        webbrowser.open("http://127.0.0.1:8090")
    except Exception:
        pass

if __name__ == "__main__":
    PORT = 8090
    print("=" * 65)
    print("  ANIL DUTTA - DIGITAL APPS, FINANCIAL ARTICLES & HELP HUB")
    print(f"  Starting master portal on http://127.0.0.1:{PORT} ...")
    print("=" * 65)
    threading.Timer(1.2, open_browser).start()
    uvicorn.run("server:app", host="127.0.0.1", port=PORT, reload=True)
