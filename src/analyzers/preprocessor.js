var assert = require( 'assert' )
  , regexMap = require( '../regexmap' ).regexMap;

function Preprocessor( emitter ) {
	this.process = function( code ) {
		var result = '';
		while (true) {
			var i = code.search( regexMap.preProcessorDirective );
			if (i != -1) {
				code = code.substr( i, code.length );
				do {
					var chunk = code.search( '\n' ) + 1; 
					result += code.substr( 0, chunk ); 
					code = code.substr( chunk, code.length );
				}	
				while (result[result.length - 2] === '\\' );
			}
			else 
				break;
		}
		emitter.emit( 'preprocess', result.trim() );
	}; 
}

exports.Preprocessor = Preprocessor;