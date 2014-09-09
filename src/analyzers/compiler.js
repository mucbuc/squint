var assert = require( 'assert' )
  , Scoper = require( './scoper' ).Scoper
  , Declarer = require( './declarer' ).Declarer
  , Definer = require( './definer' ).Definer
  , Preprocessor = require( './preprocessor' ).Preprocessor
  , Commenter = require( './commenter' ).Commenter
  , Literalizer = require( './literalizer' ).Literalizer
  , fluke = require( 'flukejs' );

assert( typeof Scoper === 'function' );
assert( typeof Declarer === 'function' );
assert( typeof Definer === 'function' );
assert( typeof Preprocessor === 'function' );
assert( typeof Literalizer === 'function' );
assert( typeof Commenter === 'function' );

function Compiler( emitter ) {
  
  var rules = {
      'preprocess': '#',
      'comment line': '\\/\\/',
      'comment block': '\\/\\*',
      'open literal': '([^//]"|^")',
      'statement': ';',
      'open': '{',
      'close': '}'
    }
    , scoper = new Scoper( emitter, rules )
	  , declarer = new Declarer( emitter )
	  , definer = new Definer( emitter )
	  , preprocessor = new Preprocessor( emitter )
    , literalizer = new Literalizer( emitter )
    , commenter = new Commenter( emitter );

  this.split = function( code ) {
    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
    }
    , rules );
  };
}

exports.Compiler = Compiler;
