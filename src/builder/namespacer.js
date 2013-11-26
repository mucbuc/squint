function Namespacer( emitter ) {
	
	emitter.on( 'open', function(code) {
		code = code.trim();
		if (code.indexOf('namespace') == 0) {
			process.nextTick( function() {
				var name = code.substr( 'namespace'.length );
				emitter.emit( 'namespace declare', name );
			} );
		}
	} ); 
}

exports.Namespacer = Namespacer;