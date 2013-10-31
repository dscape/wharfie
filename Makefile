REPORTER ?= nyan

test:
	./bin/wharfie --wharfieconf testwharfie <<< "$(DOCKERENDPOINT)" > /dev/null 2>&1
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--ui bdd \
		test/*.test.js
	rm ~/testwharfie

.PHONY: test
