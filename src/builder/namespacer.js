function Namespacer( emitter ) {
	
	var names = []
	  , nonNamespaceScopeDepths = [];

	emitter.on( 'open', function(code) {
		code = code.trim();
		if (code.indexOf('namespace') == 0) {
			var name = code.substr( 'namespace'.length )
			  , copy; 
			nonNamespaceScopeDepths.push( 0 );
			names.push( name );
			copy = names.slice();
			process.nextTick( function() {
				emitter.emit( 'namespace declare', copy );
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
		else {
			var count = nonNamespaceScopeDepths[nonNamespaceScopeDepths.length - 1];

			if (!count) {
				names.pop();
				nonNamespaceScopeDepths.pop();
			}
			else {
				--count;
			}
		}
	} );
}

exports.Namespacer = Namespacer;