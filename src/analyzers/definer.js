/* 
	think of this type as of scope "type". 

		namespace
		type
		function
*/ 


var assert = require( 'assert' )
  , Scoper = require( './scoper' ).Scoper;

assert( typeof Scoper === 'function' );

function Definer(emitter) {
	
	Scoper.call( this, emitter );

	emitter.on( 'open scope', function( code ) {

		var name = code.replace( /.*?;/, '' ).trim();
		
		if (isNamespace(code)) 
			initDefine( 'namespace' ); 
		else if (isType(code)) 
			initDefine( 'type' );
		else if (isFunction(code)) {
			name = name.replace( /\)\s*:.*/, ')' );
			initDefine( 'function' );
		}

		function initDefine( type ) {
			
			emitter.once( 'close scope', function( code ) {
				emitter.emit( 'define ' + type, { name: name, code: code.trim() } );
			} );
		}

		function isFunction( code ) {
			return code[code.length - 1] == ')';
		}

		function isType( code ) {
			return code.search( /(struct|class)/ ) != -1; 
		}

		function isNamespace( code ) {
			return code.indexOf( 'namespace' ) == 0;
		}

	} ); 
}

Definer.prototype = new Scoper();

exports.Definer = Definer;