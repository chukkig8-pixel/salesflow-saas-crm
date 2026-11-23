# =====================================================================
# SalesFlow CRM - Production Dockerfile
# Enterprise Cloud Architecture
# Multi-stage lightweight Python container
# =====================================================================

FROM python:3.13-slim AS runner

WORKDIR /app

# Set environment flags
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=5000

# Copy application files
COPY server.py ./
COPY salesflow_data.json ./
COPY public/ ./public/
COPY test_salesflow_crm.py ./

# Healthcheck definition
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/api/health')" || exit 1

EXPOSE 5000

CMD ["python", "server.py", "5000"]

