FROM node:14.15.0-alpine3.12 AS deps
WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]
COPY src src

RUN find src \! -name "package.json" \
  -mindepth 2 \
  -maxdepth 2 \
  -print \
  | xargs rm -rf

FROM node:14.15.0-alpine3.12

ENV NODE_ENV production

WORKDIR /app

COPY --from=deps /app .

RUN yarn install --frozen-lockfile --production=true --ignore-optional

COPY . .

# To restore workspaces symlinks
RUN yarn install --frozen-lockfile --production=true --ignore-optional && \
    chmod -R 755 scripts src

CMD scripts/start.sh
