var assert = require( 'assert' )
  , regexMap = require( '../regexmap' ).regexMap;

function Preprocessor( emitter ) {

  emitter.on( 'preprocess', function( token, code ) {

		var result = '';
		do {
			var chunk = code.search( '\n' ) + 1;
			result += code.substr( 0, chunk );
			code = code.substr( chunk, code.length );
		}
		while (result[result.length - 2] === '\\' );
		emitter.emit( 'consume', result.trim() );

	} );
}

exports.Preprocessor = Preprocessor;
