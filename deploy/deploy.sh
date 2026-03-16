#!/bin/bash
# ============================================================
# StackOverkill - Deployment Script
# Run from deploy/ directory - files are in parent directory
# ============================================================

set -e

echo "=== StackOverkill Deployment ==="

# Go to parent directory where images and docker-compose are located
cd "$(dirname "$0")/.."
echo "Working directory: $(pwd)"

# Check if images exist
if [ ! -f "stackoverkill-frontend.tar.gz" ] || [ ! -f "stackoverkill-backend.tar.gz" ]; then
    echo "ERROR: Docker images not found!"
    echo "Please ensure stackoverkill-frontend.tar.gz and stackoverkill-backend.tar.gz are in $(pwd)"
    exit 1
fi

# Check if docker-compose file exists
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "ERROR: docker-compose.prod.yml not found!"
    exit 1
fi

# Stop existing containers if running
echo "[1/4] Stopping existing containers..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

# Load Docker images
echo "[2/4] Loading Docker images..."
echo "  - Loading frontend..."
gunzip -c stackoverkill-frontend.tar.gz | docker load
echo "  - Loading backend..."
gunzip -c stackoverkill-backend.tar.gz | docker load

# Start containers
echo "[3/4] Starting containers..."
docker compose -f docker-compose.prod.yml up -d

# Show status
echo "[4/4] Checking status..."
sleep 3
docker compose -f docker-compose.prod.yml ps

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  Internal only (via Docker network)"
echo ""
echo "Configure your reverse proxy to forward traffic to port 3000."
echo ""
