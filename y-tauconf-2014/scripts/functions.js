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
				window.almostFactorial = function(self) {
					return function(n) {
						var fact = function(q) {
							return function(x) {
								return n === 0 ? 1 : x * q(x-1);
							};
						};
						return fact(self(self))(n);
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
				window.almostFactorial = function(self) {
					return function(n) {
						return window.fact(self(self))(n);
					};
				}
				console.log(window.almostFactorial(window.almostFactorial)(5));
			}
		},
		'y': {
			handler: function() {
				window.fix = function(f) {
					var p = function(self) {
						return function(n) {
							return f(self(self))(n);
						};
					};
					return p(p);
				};
			}
		},
		'fixed-point': {
			dependencies: ['fact', 'y'],
			handler: function() {			
				window.factorial = window.fix(window.fact);

				console.log(window.factorial(6));
			}
		},
		'log-wrapper': {
			handler: function() {
				window.logWrapper = function(f) {
					return function(self) {
						return function(n) {
							var result = f(self)(n);

							console.log('f(' + n + ') = ' + result);
							
							return result;
						};
					};
				};
			}
		},
		'log-wrap': {
			dependencies: ['fact', 'y', 'log-wrapper'],
			handler: function() {
				window.logWrappedFactorial = window.logWrapper(window.fact);
				window.logFactorial = window.fix(window.logWrappedFactorial);

				console.log(window.logFactorial(3));
			}
		},
		'hetero-wrapper': {
			handler: function() {
				window.argListWrapper = function(f) {
					return function(self) {
						return function(acc) {
							return function(n) {
								acc.push(n);

								console.log('Arguments passed: ' + acc);

								return f(self(acc))(n);
							};
						};
					};
				};
			}
		},
		'hetero-wrap': {
			dependencies: ['fact', 'y', 'hetero-wrapper'],
			handler: function() {
				window.argListWrappedFactorial = window.argListWrapper(window.fact);
				window.argListFactorial = window.fix(window.argListWrappedFactorial)([]);

				console.log(window.argListFactorial(3));
			}
		},
		'wrappers-together': {
			dependencies: ['fact', 'y', 'log-wrapper', 'hetero-wrapper'],
			handler: function() {
				window.logWrappedFactorial = window.logWrapper(window.fact);
				window.compositionWrappedFactorial = window.argListWrapper(window.logWrappedFactorial);
				window.compositionFactorial = window.fix(window.compositionWrappedFactorial)([]);

				console.log(window.compositionFactorial(7));
			}
		},
		'optimized-fact': {
			handler: function() {
				window.fact = function(self) {
					return function(n, r) {
						return n === 0 ? r : self(n - 1, n*r);
					}
				};
			}
		},
		'tail-call': {
			dependencies: ['optimized-fact'],
			handler: function() {
				window.commonFactorial = function(n, r) {
					return n === 0 ? r : window.commonFactorial(n - 1, n*r);
				};
			}
		},
		'trampoline': {
			dependencies: ['optimized-fact'],
			handler: function() {
				window.fix = function(f) {
					return function(n, r) {
						var a = null;

						for (
							a = function(n_, r_) { 
								n = n_; 
								r = r_;

								return a; 
							}; 
							a != null && a instanceof Function; 
							a = f(a)(n, r));

						return a;
					};
				};
				window.factorial = window.fix(window.fact);
				console.log(window.factorial(6, 1));
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