ROOT_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
COMMON_RUN_ARGS:=--env-file $(ROOT_DIR)/.env --env FIREBASE_CONFIG=/data/cert.json --mount type=bind,src=$(ROOT_DIR)/cert.json,dst=/data/cert.json,ro
IMGV?=latest
IMG:=mbelsky/wqw:$(IMGV)
IMGSCRPR:=mbelsky/wqw-scraper:$(IMGV)

.PHONY: build
build:
		docker build -t $(IMG) .

.PHONY: bot
bot:
		docker run --name=wqw-bot $(COMMON_RUN_ARGS) -d --restart on-failure:3 $(IMG)

.PHONY: scraper
scraper:
		docker run --rm $(COMMON_RUN_ARGS) $(IMGSCRPR)

.PHONY: worker
worker:
		docker run --rm $(COMMON_RUN_ARGS) --env WORKER=true $(IMG)

.PHONY: dev
dev: build
		docker run $(COMMON_RUN_ARGS) -it --env WORKER=true --rm $(IMG) sh

.PHONY: scraper-dev
scraper-dev:
		docker build -f Dockerfile.scraper -t wtf . \
		&& docker run $(COMMON_RUN_ARGS) -it --ipc=host --security-opt seccomp=seccomp_profile.json $(IMGSCRPR) sh
