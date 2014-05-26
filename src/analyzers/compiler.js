var assert = require( 'assert' )
  , events = require( 'events' )
  , Declarer = require( './declarer' ).Declarer
  , Definer = require( './definer' ).Definer
  , Preprocessor = require( './preprocessor' ).Preprocessor;

assert( typeof Declarer === 'function' ); 
assert( typeof Definer === 'function' );
assert( typeof Preprocessor !== 'undefined' );

function Compiler( emitter ) {

	var declarer = new Declarer(emitter)
	  , definer = new Definer(emitter);
	  
	this.process = function( code ) {
		var subEmitter = Object.create( emitter.constructor.prototype )
		  , preprocessor = new Preprocessor( subEmitter ); 
		subEmitter.on( 'preprocess', function( prepCode ) {
			code = code.replace( prepCode, '' ).trim();
			definer.process( code );
			declarer.process( code ); 
		} );
		preprocessor.process( code );
	};
}

exports.Compiler = Compiler; 