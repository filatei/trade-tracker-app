#!/bin/bash

# CONFIGURATION
USER="user1"
HOST="torama.ng"           # or myapp.torama.ng
WEB_DIR="/var/www/html/torapp.torama.ng"
LOCAL_BUILD_DIR="./dist"

# BUILD EXPORT (Optional here)
# npx expo export

echo "Uploading files to $USER@$HOST:$WEB_DIR..."
scp -r -P 2525 "$LOCAL_BUILD_DIR"/* "$USER@$HOST:$WEB_DIR"

echo "Restarting Apache on remote..."
# ssh -P 2525 "$USER@$HOST" <<EOF
#   sudo systemctl restart apache2
# EOF

echo "Deployment complete. Visit http://$HOST or https://yourdomain.com"
