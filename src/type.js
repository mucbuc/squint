var assert = require( 'assert' )
  , events = require( 'events' )
  , Scoper = require( './scoper' ).Scoper;

assert( typeof Scoper === 'function' );

function Type() {
	
	var scoperProcess; 

	Scoper.call( this );

	scoperProcess = this.process;

	this.process = function(code, emitter) {

		emitter.on( 'open scope', function( code ) {
			if (isNamespace(code)) {
				emitter.once( 'close scope', function( code ) {
					emitter.emit( 'close namespace', code );
				} );
				emitter.emit( 'open namespace', code.substr( 'namespace'.length ) );
			}
			else if (isType(code)) { 
				emitter.once( 'close scope', function( code ) { 
					emitter.emit( 'close type', code );
				} );
				emitter.emit( 'open type', code.replace( /(struct|class)/, '' ) );
			}
			else if (isFunction(code)) {
				emitter.once( 'close scope', function( code ) { 
					emitter.emit( 'close function', code );
				} );
				emitter.emit( 'open function', code );
			}
		
			function isFunction( code ) {
				return code[code.length - 1] == ')'
			}

			function isType( code ) {
				return code.search( /(struct|class)/ ) != -1; 
			}

			function isNamespace( code ) {
				return code.indexOf( 'namespace' ) == 0;
			}

		} ); 
	
		scoperProcess( code, emitter );
	};
}

Type.prototype = new Scoper();

exports.Type = Type;