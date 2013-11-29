var assert = require( 'assert' )
  , events = require( 'events' )
  , Scoper = require( './scoper' ).Scoper;

assert( typeof Scoper === 'function' );

function Namespace() {
	
	var scoperProcess; 

	Scoper.call( this );

	scoperProcess = this.process;

	this.process = function(code, emitter) {

		emitter.on( 'open scope', function( code ) {
			if (isNamespace(code)) {
				emitter.once( 'close scope', function( code ) {
					emitter.emit( 'close namespace', code );
				} );
				emitter.emit( 'open namespace', trim( code ) );
			}

			function isNamespace( code ) {
				return code.indexOf( 'namespace' ) == 0;
			}

			function trim( code ) {
				return code.substr( 'namespace'.length );
			}
		} ); 
	
		scoperProcess( code, emitter );
	};
}

Namespace.prototype = new Scoper();

exports.Namespace = Namespace;