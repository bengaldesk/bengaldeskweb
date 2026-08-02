#!/bin/bash
cd /home/z/bdesk
while true; do
  echo "[$(date)] Starting dev server..." >> /home/z/bdesk/server.log
  node_modules/.bin/next dev -p 3000 >> /home/z/bdesk/server.log 2>&1
  echo "[$(date)] Server exited, restarting in 2s..." >> /home/z/bdesk/server.log
  sleep 2
done
