var assert = require( 'assert' )
  , regexMap = require( '../regexmap' ).regexMap;

function Preprocessor( emitter ) {
	this.process = function( code ) {
		if (code.search( regexMap.preProcessorDirective ) == 0) {
			var result = ''
			do {
				var chunk = code.search( '\n' ) + 1; 
				result += code.substr( 0, chunk ); 
				code = code.substr( chunk, code.length );
			}	
			while (result[result.length - 2] === '\\' );
			emitter.emit( 'preprocess', result );

			return code;
		}
		return code;
	}; 
}

exports.Preprocessor = Preprocessor;