#!/bin/zsh
# ResumeAI Backend Starter Script

BACKEND_DIR="$(cd "$(dirname "$0")" && pwd)"
VENV_DIR="$BACKEND_DIR/venv"

echo "📂 Backend dir: $BACKEND_DIR"

# Recreate venv if it's missing or broken
if [ ! -f "$VENV_DIR/bin/uvicorn" ]; then
  echo "🔧 Setting up virtual environment..."
  rm -rf "$VENV_DIR"
  /opt/anaconda3/bin/python3 -m venv "$VENV_DIR"
  source "$VENV_DIR/bin/activate"
  echo "📦 Installing dependencies (this may take a few minutes)..."
  pip install --upgrade pip
  pip install -r "$BACKEND_DIR/requirements.txt"
  echo "🧠 Downloading spaCy model..."
  python -m spacy download en_core_web_sm
else
  source "$VENV_DIR/bin/activate"
fi

echo "🚀 Starting ResumeAI backend on http://localhost:8000 ..."
cd "$BACKEND_DIR"
uvicorn app.main:app --reload --port 8000
