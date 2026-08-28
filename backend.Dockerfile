FROM python:3.11-slim

# Install system dependencies, including Tesseract OCR
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    libtesseract-dev \
    gcc \
    g++ \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install python packages
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install spaCy English small model
RUN python -m spacy download en_core_web_sm

# Copy the backend code
COPY backend /app/backend

# Set python path to allow importing backend.* modules
ENV PYTHONPATH=/app

# Expose port 8000
EXPOSE 8000

# Start uvicorn
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
