FROM python:3.9-slim

# Prevent Python from writing .pyc files and buffer stdout/stderr.
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install PostgreSQL client.
RUN apt-get update && \
    apt-get install -y postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Copy the requirements file.
COPY requirements.txt .

# Upgrade pip and install dependencies.
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the entire backend directory.
COPY . .

EXPOSE 8000

# Run the FastAPI application using uvicorn.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]