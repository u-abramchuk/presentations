if (!window.shower) {
	return;
}

(function(window) {
	window.shower.registry = {
		'common-fact': {
			handler: function() {
				window.commonFactorial = function(n) {
					return n === 0 ? 1 : n * commonFactorial(n-1);
				};
			}
		},
		'non-rect-fact': {
			handler: function() {
				window.almostFactorial = function(f) {
					return function(n) {
						return n === 0 ? 1 : n * f(n-1);
					};
				};
			}
		},
		'apply-fact-to-itself': {
			handler: function() {
				window.almostFactorial = function(f) {
					return function(n) {
						return n === 0 ? 1 : n * f(f)(n-1);
					};
				};
				console.log(window.almostFactorial(window.almostFactorial)(5));
			}
		},
		'isolate-fixed-point': {
			handler: function() {
				window.almostFactorial = function(f) {
					return function(x) {
						var fact = function(q) {
							return function(n) {
								return n === 0 ? 1 : n * q(n-1);
							};
						};
						return fact(f(f))(x);
					};
				};
			}
		},
		'fact': {
			handler: function() {
				window.fact = function(f) {
					return function(n) {
						return n === 0 ? 1 : n * f(n-1);
					};
				};
			}
		},
		'extract-fact': {
			dependencies: ['fact'],
			handler: function() {
				window.almostFactorial = function(f) {
					return function(x) {
						return window.fact(f(f))(x);
					};
				}
				console.log(window.almostFactorial(window.almostFactorial)(5));
			}
		},
		'fixed-point': {
			dependencies: ['fact'],
			handler: function() {
				window.fix = function(f) {
					var p = function(h) {
						return function(x) {
							return f(h(h))(x);
						};
					};
					return p(p);
				};
				console.log(window.fix(window.fact)(6));
			}
		}
	};

	var runScript = function(slideHash) {
		var script = window.shower.registry[slideHash];

		if (script && script.handler) {
			if (script.dependencies) {
				for(var i = 0; i < script.dependencies.length; i++) {
					runScript(script.dependencies[i]);
				}
			}
			script.handler();
		}
	};

	var originalGo = window.shower.go;

	var newGo = function(slideNumber, callback) {
		var result = originalGo(slideNumber, callback);

		if (window.shower.isSlideMode()) {
			var slideHash = window.shower.getSlideHash(slideNumber).substr(1);	

			runScript(slideHash);
		}

		return result;
	}

	window.shower.go = newGo.bind(window.shower);
})(window);