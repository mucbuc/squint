function Namespacer( emitter ) {
	
	var names = []
	  , nonNamespaceScopeDepths = [];

	emitter.on( 'open', function(code) {
		code = code.trim();
		if (code.indexOf('namespace') == 0) {
			process.nextTick( function() {
				var name = code.substr( 'namespace'.length );
				nonNamespaceScopeDepths.push( 0 );
				names.push( name );
				emitter.emit( 'namespace declare', names );
			} );
		}
		else if (!nonNamespaceScopeDepths.length) {
			nonNamespaceScopeDepths.push(1)
		}
		else {
			++nonNamespaceScopeDepths[ nonNamespaceScopeDepths.length - 1 ];
		}
	} ); 

	emitter.on( 'close', function() { 
		if (!nonNamespaceScopeDepths.length) {
			names.pop();
		}
		else if (!--nonNamespaceScopeDepths[nonNamespaceScopeDepths.length - 1]) {
			names.pop();
			nonNamespaceScopeDepths.pop();
		}
	} );
}

exports.Namespacer = Namespacer;