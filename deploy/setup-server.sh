#!/bin/bash
# ============================================================
# StackOverkill - Server Setup Script for Debian 13
# Run as root or with sudo
# ============================================================

set -e

echo "=== StackOverkill Server Setup ==="

# Update system
echo "[1/3] Updating system..."
apt update && apt upgrade -y

# Install Docker via apt (docker.io)
echo "[2/3] Installing Docker..."
apt install -y docker.io docker-compose

# Add mc-admin to docker group
usermod -aG docker mc-admin

# Open firewall port for frontend
echo "[3/3] Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 3000/tcp
    echo "UFW: Port 3000 opened"
else
    echo "WARNING: UFW not found. Please manually open port 3000."
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Log out and log back in (for docker group to take effect)"
echo "2. Run: ./deploy.sh"
echo ""
