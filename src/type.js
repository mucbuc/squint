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
				initScopeType( 'namespace' ); 
			else if (isType(code)) { 
				initScopeType( 'type' );
			else if (isFunction(code)) {
				initScopeType( 'function' );

			function initScopeType( name, code ) {
				emitter.once( 'close scope', function( code ) {
					emitter.emit( 'close ' + name );
				} );
				emitter.emit( 'open ' + name, code );
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