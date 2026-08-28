# 🛡️ NewsGuard AI - Intelligent Misinformation & Claim Verification

**NewsGuard AI** is a professional, explainable AI-powered misinformation investigation system. Instead of simply rating content as "true" or "false," NewsGuard AI breaks articles down claim-by-claim, retrieves evidence, highlights shifts in meaning between original facts and viral claims ("Meaning Drift"), detects common propaganda/misinformation techniques, and maps all evidence links in an interactive graph.

---

## 🚀 Key Features

* **Claim Extraction & Decomposition**: Isolates factual assertions and splits them into Subject, Predicate, Scope, and Magnitude to analyze qualifiers.
* **Fact vs Opinion Classification**: Automatically bypasses subjective opinions or personal commentary, focus-verifying verifiable statements.
* **RAG Pipeline & Semantic Search**: Queries a local vector database (TF-IDF/cosine) and simulated web search registries to extract corroborating/refuting passages.
* **Meaning Drift / "What Changed?"**: Signature feature detecting alterations in certainty levels (e.g., changes from "may reduce risk" to "completely prevents") or scope (e.g., "tested in mice" to "everyone should drink").
* **Misinformation Technique Alerts**: Detects specific patterns (Exaggeration, Outdated Information, Context Collapse, False Attribution, opinion-as-fact, etc.).
* **NewsGuard Reliability Indicator (0-100)**: A transparent reliability meter with component scores for Evidence Support, Source Quality, Context Completeness, and Claim Consistency.
* **Interactive Evidence Graph**: Visualizes claims linked to sources via color-coded relationships (Supports, Contradicts, Contextualizes) built in React Flow.
* **Offline Demo Mode**: Fully functional client-side and backend fallback allowing you to run the complete product, animations, reports, and interactive charts even if external LLM keys are absent.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), Tailwind CSS, React Flow, Recharts, Lucide Icons.
* **Backend**: Python 3.10+, FastAPI, SQLAlchemy, SQLite (designed for quick PostgreSQL conversion).
* **AI/NLP**: Direct LLM endpoints (Gemini, OpenAI), optional spaCy en_core_web_sm, OCR simulation.

---

## 📁 Project Structure

```text
d:\NewsGaurd/
├── backend/
│   ├── main.py                  # FastAPI Application router & controller orchestration
│   ├── database/
│   │   ├── connection.py        # SQLAlchemy SQLite connection setup
│   │   └── demo_data.py         # 3 high-fidelity pre-compiled demo scenarios
│   ├── models/
│   │   └── database_models.py   # SQLAlchemy Report, Claim, and Evidence DB tables
│   ├── schemas/
│   │   └── api_schemas.py       # Pydantic serialization request & response models
│   ├── services/
│   │   ├── llm_service.py       # Gemini & OpenAI HTTP client calls with mock sandboxes
│   │   ├── claim_service.py     # NLP/Regex sentence filters and fact/opinion tags
│   │   ├── evidence_service.py  # Local TF-IDF/cosine similarity and web search simulators
│   │   ├── rag_service.py       # Verdict and source alignment orchestrations
│   │   ├── verification_service.py # Orchestrates verification across claim list
│   │   ├── misinformation_service.py # Categorizes deceptive techniques (Exaggeration, etc.)
│   │   ├── meaning_drift_service.py  # Tracks alterations in statement semantics
│   │   └── scoring_service.py   # Generates transparent NewsGuard indicator values
│   └── utils/
│       └── document_processor.py # PDF processing (PyMuPDF) and OCR (Tesseract) support
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.jsx         # Landing page and features presentation
│   │   │   ├── InputPanel.jsx   # Text/URL/Image upload tabs and demo trigger selectors
│   │   │   ├── AnalysisProgress.jsx # 8-step deep scanning scanner layout
│   │   │   ├── ReliabilityScore.jsx # Speedometer and Recharts bar breakdowns
│   │   │   ├── EvidenceGraph.jsx # React Flow claim-evidence connector network
│   │   │   └── ReportView.jsx   # Detailed report layouts and printing support
│   │   ├── App.jsx              # Application router controller and fallback data
│   │   ├── index.css            # Custom CSS classes (animations, grids, scrollbars)
│   │   └── main.jsx             # Entry script
│   ├── tailwind.config.js       # Theme palette details
│   └── postcss.config.js        # Postcss loader
├── .env.example                 # Config template
├── docker-compose.yml           # Multi-container config
└── README.md                    # This document
```

---

## ⚙️ Installation & Setup

### 1. Backend Setup

From the root directory:

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies (ensure requests and sqlalchemy are present)
pip install fastapi uvicorn sqlalchemy requests
# Optional (for PDF parsing & OCR support):
pip install pymupdf pytesseract pillow
# Optional (for NLP model processing):
pip install spacy
python -m spacy download en_core_web_sm
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

To run with live AI API calls, fill in your Google Gemini or OpenAI developer key:
* `GEMINI_API_KEY=your-gemini-api-key`
* `OPENAI_API_KEY=your-openai-api-key`

*If left blank, NewsGuard AI runs automatically in **Demo Mode** using local guidelines.*

### 3. Start the Backend Server

```bash
uvicorn backend.main:app --reload --port 8000
```
*API documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)*

### 4. Frontend Setup

In a separate terminal, navigate to the `frontend` folder:

```bash
cd frontend

# Install package dependencies
npm install --legacy-peer-deps

# Start Vite Development Server
npm run dev
```
*Open [http://localhost:5173](http://localhost:5173) in your browser.*

---

## 🛡️ Hackathon Demonstration Guide

Click the **Try Demo** button on the homepage or choose a scenario from the input panel:

1. **🍷 Scientific Exaggeration**: Demonstrates claim extraction, showing how a study on mice resveratrol is exaggerated into drinking two glasses of red wine daily. Surfaces *Exaggeration* and *Missing Context* meaning drift.
2. **⏳ Outdated Lockdown Alert**: Demonstrates context collapse by catching a March 2020 border advisory presented without a date as a current event.
3. **Smart City Conspiracy**: Processes 5 distinct claims (2 Supported, 2 Contradicted, 1 Insufficient Evidence) to showcase claim-level auditing instead of a generic True/False indicator.

---

## 📝 API Endpoints Summary

* `POST /api/analyze`: Coordinates analysis. Integrates OCR, Scraping, claim decomposition, verification, meaning drift, and reliability scoring.
* `POST /api/extract-claims`: Extracts sentences and filters verifiable facts.
* `POST /api/retrieve-evidence`: Searches local indices and retrieves contextual web references.
* `GET /api/report/{id}`: Loads past saved analysis reports from the SQLite database.
* `GET /api/health`: Monitors engine key parameters.
