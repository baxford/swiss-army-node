.PHONY: install test clean

install: 
	@npm update
tests:
	@NODE_ENV=unit-test ./node_modules/mocha/bin/mocha
clean:
	rm -rf node_modules	
clean-db:
	@node database/dbRunner.js clean
update-db:
	@node database/dbRunner.js install
db-scripts:
	@node database/dbRunner.js scripts
all: install update-db test
