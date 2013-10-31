REPORTER ?= nyan

test:
	touch ~/testwharfie
	rm ~/testwharfie > /dev/null 2>&1
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--ui bdd \
		test/*.test.js

.PHONY: test
