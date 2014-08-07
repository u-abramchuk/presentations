if (window.shower) {	
	window.shower.registry = {
			'fixed-point-cosine': {
				handler: function() {
					var container = document.getElementById("fixed-point-cosine-svg");
					if (!container.innerHTML.length) {
						var xhr = new XMLHttpRequest();

						xhr.open('GET', 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Cosine_fixed_point.svg', false);
						xhr.overrideMimeType('image/svg+xml');
						xhr.send('');
						
						container.appendChild(xhr.responseXML.documentElement);	
					}
				}
			},
			'common-fact': {
				handler: function() {
					window.commonFactorial = function(n) {
						return n === 0 ? 1 : n * commonFactorial(n-1);
					};
				}
			},
			'non-rect-fact': {
				handler: function() {
					window.almostFactorial = function(self) {
						return function(n) {
							return n === 0 ? 1 : n * self(n-1);
						};
					};
				}
			},
			'almost-fact-fixed-point': {
				dependencies: ['common-fact', 'non-rect-fact'],
				handler: function() {
					console.log(window.almostFactorial(window.commonFactorial)(4) === window.commonFactorial(4));
					console.log(window.almostFactorial(window.commonFactorial)(10) === window.commonFactorial(10));
					console.log(window.almostFactorial(window.commonFactorial)(17) === window.commonFactorial(17));
				}
			},
			'apply-fact-to-itself': {
				handler: function() {
					window.almostFactorial = function(self) {
						return function(n) {
							return n === 0 ? 1 : n * self(self)(n-1);
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
					window.fact = function(self) {
						return function(n) {
							return n === 0 ? 1 : n * self(n-1);
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
					window.logFactorial = window.fix(window.logWrapper(window.fact));

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
					window.argListFactorial = window.fix(window.argListWrapper(window.fact))([]);

					console.log(window.argListFactorial(3));
				}
			},
			'wrappers-together': {
				dependencies: ['fact', 'y', 'log-wrapper', 'hetero-wrapper'],
				handler: function() {
					window.compositionFactorial = window.fix(
						window.argListWrapper(
						window.logWrapper(
						window.fact))
					)([]);

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
			},
			'reflect-quine': {
				handler: function() {
					window.quine = function() {
						(function $(){console.log('('+$+'());')}());

					};
				}
			},
			'quine': {
				handler: function() {
					window.quine = function() {
	var newLine = String.fromCharCode(10);
	//intron
	var data = 'var newLine = String.fromCharCode(10);%3//intron%3%3var data = %1%0%1;%3console.log(data.replace(/%21/g, "%1").replace(/%23/g, newLine).replace(/%22/g, "%").replace("%20", data));';
	console.log(data.replace(/%1/g, "'").replace(/%3/g, newLine).replace(/%2/g, "%").replace("%0", data));					
					};
				}
			}
		};
}