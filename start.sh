#!/bin/bash
source "$(dirname "$0")/venv/bin/activate"
echo "Starting Django on port 8002 (auto-restarts on crash)..."
while true; do
    python manage.py runserver 8002
    echo "Server stopped. Restarting in 2 seconds..."
    sleep 2
done
