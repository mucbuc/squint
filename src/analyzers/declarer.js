/* 
	think of this type as of scope "type". 

		namespace
		type
		function
*/ 

var assert = require( 'assert' )
  , events = require( 'events' )
  , Parser = require( 'mucbuc-jsthree' ).Parser
  , Scoper = require( './scoper' ).Scoper;

function Declarer(emitter) {

	Scoper.call( this, emitter );

	emitter.on( 'open scope', function( code ) {
		declare(code); 
	} );
	
	emitter.on( 'end', function( code ) {
		declare(code);
	} );

	function declare(code) {
		
		var sub = Object.create( emitter.constructor.prototype )  
		  , parser = new Parser( sub );

		sub.on( 'statement', function(code) {
			if (isType(code)) {
				emitter.emit( 'declare type', code );
			}
			else if (isFunctionDeclaration(code)) { 
				emitter.emit( 'declare function', code );
			}	

			function isFunctionDeclaration(code) {
				return code.search( /(\w*\s+)*\w*\s*\(.*\)\s*/ ) == 0;
			}

			function isType() {
				return code.search( /(struct|class)/ ) != -1; 
			}
		} );

		parser.process( code );
	}
}

Declarer.prototype = new Scoper();

exports.Declarer = Declarer;