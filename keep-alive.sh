#!/bin/bash
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting..." >> /home/z/my-project/server.log
  node_modules/.bin/next dev -p 3000 >> /home/z/my-project/server.log 2>&1
  echo "[$(date)] Exited, restarting..." >> /home/z/my-project/server.log
  sleep 2
done
