.PHONY: install dev build test lint docker-build docker-up clean

install:
	npm install

dev:
	npm run start:dev

build:
	npm run build

test:
	npm test

lint:
	npm run lint

docker-build:
	docker-compose build

docker-up:
	docker-compose up

clean:
	rm -rf dist node_modules coverage

