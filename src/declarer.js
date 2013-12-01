/* 
	think of this type as of scope "type". 

		namespace
		type
		function
*/ 

var assert = require( 'assert' )
  , events = require( 'events' )
  , Parser = require( './parser' ).Parser;

function Declarer() {

	var parserProcess; 

	Parser.call( this );

	parserProcess = this.process;

	this.process = function(code, emitter) {

		emitter.on( 'statement', function(code) {
			
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

		parserProcess( code, emitter );
	}; 
}

Declarer.prototype = new Parser();

exports.Declarer = Declarer;