#!/bin/bash
set -e

echo "Configuring environment..."
export ENVIRONMENT="test"
export PYTHONPATH=$(pwd)

# Install Python dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
  echo "Installing Python dependencies..."
  pip install -r requirements.txt
fi

# Install Node dependencies if package.json exists
if [ -f "package.json" ]; then
  echo "Installing Node dependencies..."
  npm install
fi

echo "Environment setup complete."

# Run behave tests if features directory exists
if [ -d "features" ]; then
  if command -v behave >/dev/null 2>&1; then
    echo "Running behave tests..."
    behave
    echo "Behave tests complete."
  else
    echo "Behave not installed, skipping behave tests."
  fi
fi

# Run Python unit tests
if command -v pytest >/dev/null 2>&1; then
  echo "Running pytest..."
  pytest
  echo "pytest complete."
else
  echo "Running Python unittest discover..."
  python -m unittest discover
  echo "Unittest tests complete."
fi

echo "All tests executed."