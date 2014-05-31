var assert = require( 'assert' )
  , Parser = require( 'mucbuc-jsthree' ).Parser
  , regexMap = require( '../regexmap' ).regexMap; 

function Declarer(emitter) {

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
				return code.search( regexMap.functionDeclare ) == 0;
			}

			function isType() {
				return code.search( regexMap.typeDeclare ) != -1; 
			}
		} );

		parser.process( code );
	}
}

exports.Declarer = Declarer;