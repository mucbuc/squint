function Namespacer( emitter ) {
	
	emitter.on( 'open', function(code) {
		if (code.indexOf('namespace') == 0) {
			emitter.emit( 'namespace declare', code );
		}
	} ); 
	// emitter.on( 'close', function() {

	// } ); 
}

exports.Namespacer = Namespacer;