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
			initDefine( 'namespace', name ); 
		else if (isType(code)) 
			initDefine( 'type', name );
		else if (isFunction(code)) 
			initDefine( 'function', name );
		
		function initDefine( type, name ) {
			emitter.once( 'close scope', function( code ) {
				var matches = name.match( /(.*\))\s*:(.*)/, '' );
				if (matches)
					emitter.emit( 'define ' + type, { 
						name: matches[1],
						code: code, 
						meta: matches[2].trim(), 
					} );
				else 
					emitter.emit( 'define ' + type, { 
						name: name,
						code: code 
					} );
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