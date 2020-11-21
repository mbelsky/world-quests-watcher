#! /bin/sh

if [[ "$WORKER" ]]; then
  node src/worker/worker.js
else
  node src/di-bot/di-bot.js
fi
