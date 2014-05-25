var assert = require( 'assert' )
  , regexMap = require( '../regexmap' ).regexMap;

function Preprocessor( emitter ) {
	this.process = function( code ) {
		var matches = code.match( regexMap.preProcessorDirective ); 
		if (matches) {
			matches.forEach( function( match ) {
				emitter.emit( 'preprocess', match.trim() );
			} );
		} 
	}; 
}

exports.Preprocessor = Preprocessor;