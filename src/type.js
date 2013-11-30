/* 
	think of this type as of scope "type". 

		namespace
		type
		function
*/ 


var assert = require( 'assert' )
  , Scoper = require( './scoper' ).Scoper;

assert( typeof Scoper === 'function' );

function Type() {
	
	var scoperProcess; 

	Scoper.call( this );

	scoperProcess = this.process;

	this.process = function(code, emitter) {

		emitter.on( 'open scope', function( code ) {
			
			if (isNamespace(code)) 
				initDefine( 'namespace' ); 
			else if (isType(code)) 
				initDefine( 'type' );
			else if (isFunction(code)) 
				initDefine( 'function' );

			function initDefine( type ) {
				var name = code.trim();
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
	
		scoperProcess( code, emitter );
	};
}

Type.prototype = new Scoper();

exports.Type = Type;