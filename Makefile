.PHONY: dev build test start clean

dev:
	npm run start:dev

build:
	npm run build

test:
	npm test

start:
	docker-compose up

clean:
	rm -rf dist node_modules coverage

