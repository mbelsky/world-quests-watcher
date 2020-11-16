#! /bin/sh

if [[ "$CRON" ]]; then
  crond -f -d 8
else
  node src/di-bot/di-bot.js
fi
