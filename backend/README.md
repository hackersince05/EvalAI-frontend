# EvalAI Backend

> AI-powered automated assessment system for theory questions, built with FastAPI and PostgreSQL.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Installation & Running](#installation--running)
- [Database Setup](#database-setup)
- [API Overview](#api-overview)
- [Authentication](#authentication)
- [User Roles](#user-roles)
- [Development Tips](#development-tips)

---

## Overview

EvalAI is a backend system that uses **Sentence-BERT (SBERT)** to automatically grade student answers to theory questions. It compares student responses to model answers using semantic similarity, producing scores and feedback without relying on exact keyword matching.

The system supports two roles — **Lecturers** and **Students** — with JWT-based authentication and optional OAuth via Google, Microsoft, and GitHub.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI 0.127 |
| Database | PostgreSQL (via SQLAlchemy 2.0) |
| Migrations | Alembic |
| ML Model | `sentence-transformers` (`all-MiniLM-L6-v2`) |
| Auth | JWT (`python-jose`) + bcrypt (`passlib`) |
| Server | Uvicorn |
| Python | 3.10+ |

---

## Project Structure

```
backend/
├── app/
│   ├── main.py                  # App entry point, router registration, startup events
│   ├── database.py              # DB engine, session factory, init_db()
│   ├── model.py                 # SBERT model loader (singleton)
│   ├── enhanced_scorer.py       # Rubric-based scoring logic (accuracy, completeness, clarity)
│   ├── crud.py                  # General CRUD operations
│   │
│   ├── core/
│   │   ├── config.py            # Settings loaded from environment variables
│   │   └── logging.py           # Centralized logging setup
│   │
│   ├── api/
│   │   └── routes/
│   │       ├── assessment.py    # POST /assess — single answer grading
│   │       ├── enhanced.py      # POST /assess/enhanced — rubric-based grading
│   │       ├── questions.py     # CRUD for question bank
│   │       ├── students.py      # Student-facing assessment endpoints
│   │       ├── lecturer.py      # Lecturer dashboard, grading, submissions
│   │       ├── analytics.py     # System-wide analytics and statistics
│   │       ├── paper.py         # Paper/exam management
│   │       ├── auth.py          # Register, login, token refresh
│   │       └── oauth.py         # Google / Microsoft / GitHub OAuth
│   │
│   ├── models/                  # SQLAlchemy ORM models
│   ├── schemas/                 # Pydantic request/response schemas
│   ├── services/                # Business logic (assessment_service, etc.)
│   └── utils/
│       ├── auth.py              # JWT creation, password hashing
│       └── dependencies.py      # FastAPI dependency injection (role guards)
│
├── alembic/                     # Database migration scripts
│   ├── env.py
│   └── versions/
├── alembic.ini                  # Alembic configuration
├── requirements.txt             # Python dependencies
└── .env                         # Environment variables (not committed)
```

---

## Prerequisites

Make sure the following are installed on your machine before proceeding:

- **Python 3.10+** — [python.org](https://www.python.org/downloads/)
- **PostgreSQL 13+** — [postgresql.org](https://www.postgresql.org/download/)
- **pip** — comes with Python
- **git** — for cloning the repo

Optionally, install `virtualenv` or use Python's built-in `venv`.

---

## Environment Setup

### 1. Clone the repository and navigate to the backend

```bash
git clone <your-repo-url>
cd your-project/backend
```

### 2. Create and activate a virtual environment

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

> **Note:** The first install may take a few minutes — PyTorch and the sentence-transformers library are large packages.

### 4. Create a `.env` file

Create a `.env` file in the `backend/` directory. This file is **never committed** to version control.

```env
# Application
APP_NAME="EvalAI - SERT Automated Theory Assessment"
APP_VERSION="2.0.0"
DEBUG=False

# URLs
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# Database — update with your PostgreSQL credentials
DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/evalai_db

# JWT Secret — change this to a long random string in production
SECRET_KEY=your-super-secret-jwt-key-change-this

# ML Model
MODEL_NAME=all-MiniLM-L6-v2

# OAuth (optional — leave blank to disable)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Assessment thresholds
DEFAULT_MAX_SCORE=10
SIMILARITY_THRESHOLD_EXCELLENT=0.85
SIMILARITY_THRESHOLD_GOOD=0.70
SIMILARITY_THRESHOLD_FAIR=0.50
```

---

## Database Setup

### 1. Create the PostgreSQL database

Log into PostgreSQL and create the database:

```sql
CREATE DATABASE evalai_db;
```

Or using the command line:

```bash
psql -U postgres -c "CREATE DATABASE evalai_db;"
```

### 2. Run database migrations

From the `backend/` directory (with your virtual environment activated):

```bash
alembic upgrade head
```

This applies all migration scripts and creates the necessary tables.

### 3. (Optional) Create a new migration after model changes

If you add or modify SQLAlchemy models, generate a new migration:

```bash
alembic revision --autogenerate -m "describe your change here"
alembic upgrade head
```

---

## Installation & Running

### Start the development server

From the `backend/` directory:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- `--reload` enables hot-reloading on file changes (for development only)
- The server starts at **http://localhost:8000**

### Confirm it's running

Visit **http://localhost:8000** — you should see:

```json
{
  "message": "EvalAI backend is running",
  "status": "OK",
  "version": "2.0.0"
}
```

### Health check

```
GET http://localhost:8000/health
```

---

## API Overview

Interactive API documentation is auto-generated by FastAPI:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Route Summary

| Prefix | Description | Auth Required |
|---|---|---|
| `GET /` | Health check | No |
| `GET /health` | Detailed health check | No |
| `POST /auth/register` | Register a new user | No |
| `POST /auth/login` | Login and receive JWT | No |
| `GET /auth/me` | Get current user info | Yes |
| `POST /assess` | Grade a single answer | Student |
| `POST /assess/enhanced` | Rubric-based grading | Student |
| `GET /questions` | List all questions | Teacher |
| `POST /questions` | Create a question | Teacher |
| `PUT /questions/{id}` | Update a question | Teacher |
| `DELETE /questions/{id}` | Delete a question | Teacher |
| `GET /students/assessments` | List available assessments | Student |
| `POST /students/assessments/{id}/submit` | Submit answers | Student |
| `GET /students/submissions` | View own submissions | Student |
| `GET /paper` | List all papers/exams | Teacher |
| `POST /paper` | Create a paper | Teacher |
| `GET /lecturer/dashboard` | Analytics dashboard | Teacher |
| `GET /lecturer/submissions/{id}` | View submission details | Teacher |
| `GET /analytics/overview` | System-wide statistics | Teacher |
| `GET /analytics/student/{id}` | Per-student analytics | Teacher |
| `GET /analytics/subject/{name}` | Per-subject analytics | Teacher |

---

## Authentication

The API uses **JWT Bearer tokens**.

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "username": "jdoe",
  "email": "jdoe@example.com",
  "password": "securepassword",
  "full_name": "John Doe",
  "role": "student"   // or "lecturer"
}
```

### Login

```http
POST /auth/login
Content-Type: application/x-www-form-urlencoded

username=jdoe&password=securepassword
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

### Using the token

Include the token in the `Authorization` header for all protected routes:

```http
Authorization: Bearer eyJ...
```

---

## User Roles

| Role | Access |
|---|---|
| `student` | Take assessments, view own submissions, get feedback |
| `lecturer` | Manage questions, create papers, view all submissions, access analytics |
| `admin` | Full access (all lecturer permissions + user management) |

Role guards are enforced via FastAPI dependencies in `app/utils/dependencies.py`:
- `require_student` — allows students and above
- `require_teacher` — allows lecturers and admins only
- `require_admin` — allows admins only

---

## Development Tips

### Running with verbose SQL logging

Set `echo=True` in `app/database.py` to print all SQL queries to the console — helpful for debugging database issues.

### Checking the ML model

The SBERT model (`all-MiniLM-L6-v2`) is downloaded automatically on first run via the `sentence-transformers` library. It's cached locally after the first download. If you need to change the model, update `MODEL_NAME` in your `.env` file.

### Resetting the database (development only)

```bash
alembic downgrade base   # Rolls back all migrations
alembic upgrade head     # Re-applies all migrations
```

### CORS

The allowed origins for CORS are configured in `app/main.py`. For local development, the following origins are permitted by default:
- `http://localhost:5173` (Vite frontend)
- `http://localhost:3000`
- `http://localhost:8080`

Update these for production deployments.

### Environment variable precedence

Settings are loaded from `.env` via `pydantic-settings`. Any variable set in your shell environment will override the `.env` file values.