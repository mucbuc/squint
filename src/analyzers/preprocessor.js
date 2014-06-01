var assert = require( 'assert' )
  , regexMap = require( '../regexmap' ).regexMap;

function Preprocessor( emitter ) {

  emitter.on( 'preprocessor', function( token, code ) {
    while (true) {
			var i = code.search( regexMap.preProcessorDirective );
			if (i != -1) {
				var result = '';
				code = code.substr( i, code.length );
				do {
					var chunk = code.search( '\n' ) + 1;
					result += code.substr( 0, chunk );
					code = code.substr( chunk, code.length );
				}
				while (result[result.length - 2] === '\\' );
				emitter.emit( 'consume', result.trim() );
			}
			else
				break;
		}
	} );
}

exports.Preprocessor = Preprocessor;
