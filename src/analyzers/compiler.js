var assert = require( 'assert' )
  , Scoper = require( './scoper' ).Scoper
  , Declarer = require( './declarer' ).Declarer
  , Definer = require( './definer' ).Definer
  , Preprocessor = require( './preprocessor' ).Preprocessor;

assert( typeof Scoper === 'function' );
assert( typeof Declarer === 'function' );
assert( typeof Definer === 'function' );
assert( typeof Preprocessor === 'function' );

function Compiler( emitter ) {

  var rules = {
      'preprocess': '#',
      'comment line': '\\/\\/',
      'comment block': '\\/\\*',
      'statement': ';',
      'open': '{',
      'close': '}',
    }
    , scoper = new Scoper( emitter, rules )
	  , declarer = new Declarer(emitter)
	  , definer = new Definer(emitter)
	  , preprocessor = new Preprocessor( emitter );

	this.process = function( code ) {
		scoper.process( code );
	};
}

exports.Compiler = Compiler;
