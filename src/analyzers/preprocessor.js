var assert = require( 'assert' )
  , regexMap = require( '../regexmap' ).regexMap;

function Preprocessor( emitter ) {
	this.process = function( code ) {
		var result = '';
		while (code.search( regexMap.preProcessorDirective ) == 0) {
			do {
				var chunk = code.search( '\n' ) + 1; 
				result += code.substr( 0, chunk ); 
				code = code.substr( chunk, code.length );
			}	
			while (result[result.length - 2] === '\\' );
		}
		emitter.emit( 'preprocess', result.trim() );
	}; 
}

exports.Preprocessor = Preprocessor;