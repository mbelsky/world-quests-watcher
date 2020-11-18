FROM alpine:3.12 AS deps
WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]
COPY src src

RUN find src \! -name "package.json" \
  -mindepth 2 \
  -maxdepth 2 \
  -print \
  | xargs rm -rf

FROM mcr.microsoft.com/playwright:bionic

ENV NODE_ENV production
WORKDIR /app

COPY --from=deps /app .

RUN addgroup --gid 1007 wqw-scraper && \
    adduser -u 1001 --gid 1007 --gecos '' --disabled-password --shell /bin/sh wqw-scraper

RUN mkdir /yarn-cache \
  && yarn install --frozen-lockfile --production=true

COPY . .

RUN chmod -R 755 /root scripts src \
&& chown -R wqw-scraper:wqw-scraper .

USER wqw-scraper

# To restore workspaces symlinks
RUN yarn install --frozen-lockfile --production=true

CMD ["node", "src/scraper/scraper.js"]
