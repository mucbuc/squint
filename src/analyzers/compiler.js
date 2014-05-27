var assert = require( 'assert' )
  , Declarer = require( './declarer' ).Declarer
  , Definer = require( './definer' ).Definer
  , Preprocessor = require( './preprocessor' ).Preprocessor;

assert( typeof Declarer === 'function' ); 
assert( typeof Definer === 'function' );
assert( typeof Preprocessor === 'function' );

function Compiler( emitter ) {

	var declarer = new Declarer(emitter)
	  , definer = new Definer(emitter)
	  , preprocessor = new Preprocessor( emitter );

	this.process = function( code ) {
		emitter.on( 'preprocess', function( prepCode ) {
			code = code.replace( prepCode, '' ).trim();
			definer.process( code );
			declarer.process( code ); 
		} );
		preprocessor.process( code );
	};
}

exports.Compiler = Compiler; 