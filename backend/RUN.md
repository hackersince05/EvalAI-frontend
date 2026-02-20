# EvalAI Backend — Run Instructions

Follow these steps in order every time you want to run the backend locally.

---

## Step 1 — Navigate to the Backend Directory

```bash
cd path/to/your-project/backend
```

All commands below must be run from inside the `backend/` folder.

---

## Step 2 — Activate the Virtual Environment

You only need to create the virtual environment once. After that, just activate it each session.

**Create it (first time only):**

```bash
# macOS / Linux
python3 -m venv venv

# Windows
python -m venv venv
```

**Activate it (every time):**

```bash
# macOS / Linux
source venv/bin/activate

# Windows (Command Prompt)
venv\Scripts\activate

# Windows (PowerShell)
venv\Scripts\Activate.ps1
```

You'll know it's active when you see `(venv)` at the start of your terminal prompt.

---

## Step 3 — Install Dependencies

Run this whenever `requirements.txt` changes. Safe to re-run anytime.

```bash
pip install -r requirements.txt
```

> **First install note:** This will download PyTorch and sentence-transformers, which are large. Expect it to take a few minutes on the first run.

---

## Step 4 — Set Up the `.env` File

If you don't already have a `.env` file in the `backend/` folder, create one now:

```env
DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/evalai_db
SECRET_KEY=some-long-random-secret-key
DEBUG=False
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
MODEL_NAME=all-MiniLM-L6-v2

# OAuth — leave blank if not using
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Replace `your_db_user` and `your_db_password` with your actual PostgreSQL credentials.

---

## Step 5 — Set Up the Database

### 5a. Make sure PostgreSQL is running

```bash
# macOS (Homebrew)
brew services start postgresql

# Linux (systemd)
sudo systemctl start postgresql

# Windows — start via pgAdmin or Services panel
```

### 5b. Create the database (first time only)

```bash
psql -U postgres -c "CREATE DATABASE evalai_db;"
```

### 5c. Run migrations

```bash
alembic upgrade head
```

This creates all the required tables. It's safe to run every time — it only applies new migrations.

---

## Step 6 — Start the Server

### Option A — Using `run.py` (recommended on Windows)

```bash
python run.py
```

### Option B — Using uvicorn directly (macOS / Linux)

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Step 7 — Confirm It's Running

Open your browser or use curl:

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{
  "status": "healthy",
  "app": "EvalAI - SERT Automated Theory Assessment",
  "version": "2.0.0"
}
```

You can also open the interactive API docs at:

```
http://localhost:8000/docs
```

---

## Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

To deactivate the virtual environment when you're done:

```bash
deactivate
```

---

## Quick Reference — Common Commands

| Task                                     | Command                                     |
| ---------------------------------------- | ------------------------------------------- |
| Activate virtual environment (Mac/Linux) | `source venv/bin/activate`                  |
| Activate virtual environment (Windows)   | `venv\Scripts\activate`                     |
| Install / update dependencies            | `pip install -r requirements.txt`           |
| Run database migrations                  | `alembic upgrade head`                      |
| Start server (Windows)                   | `python run.py`                             |
| Start server (Mac/Linux)                 | `uvicorn app.main:app --reload --port 8000` |
| View API docs                            | http://localhost:8000/docs                  |
| Health check                             | http://localhost:8000/health                |
| Stop server                              | `Ctrl + C`                                  |
| Deactivate virtual environment           | `deactivate`                                |

---

## Troubleshooting

**`ModuleNotFoundError`** — Your virtual environment is not activated, or dependencies are not installed. Run `source venv/bin/activate` then `pip install -r requirements.txt`.

**`could not connect to server` (database error)** — PostgreSQL is not running. Start it with `brew services start postgresql` (Mac) or `sudo systemctl start postgresql` (Linux).

**`relation "users" does not exist`** — Migrations haven't been applied. Run `alembic upgrade head`.

**Port 8000 already in use** — Another process is using the port. Either stop it, or run on a different port: `uvicorn app.main:app --reload --port 8001`.

**`SBERT model downloading...` on first start** — Normal behaviour. The `all-MiniLM-L6-v2` model is downloaded and cached on first run. Subsequent starts will be fast.
