var assert = require( 'assert' );

function Preprocessor( emitter ) {
	this.process = function( code ) {
		var matches = code.match( /#.*\n/g ); 
		matches.forEach( function( match ) {
			emitter.emit( 'preprocess', match.trim() );
		} ); 
	}; 
}

exports.Preprocessor = Preprocessor;