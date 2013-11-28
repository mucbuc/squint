function Namespacer( emitter ) {
	
	var names = []
	  , typers = []
	  , nonNamespaceScopeDepths = [];

	emitter.on( 'open', function(code) {
		code = code.trim();
		if (code.indexOf('namespace') == 0) {
			var name = code.substr( 'namespace'.length );
			emitter.emit( 'open namespace', name );
			nonNamespaceScopeDepths.push( 0 );
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
			emitter.emit( 'close namespace' );
		}
		else {
			var count = nonNamespaceScopeDepths[nonNamespaceScopeDepths.length - 1];

			if (!count) {
				nonNamespaceScopeDepths.pop();
				emitter.emit( 'close namespace' );
			}
			else {
				--count;
			}
		}
	} );
}

exports.Namespacer = Namespacer;