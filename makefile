make: lint clean minify

clean:
	@rm -rf *.min.js

minify:
	@./node_modules/.bin/terser --compress --mangle -o ./passport.min.js -- ./passport.js

lint:
	@./node_modules/.bin/eslint ./passport.js
