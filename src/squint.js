var assert = require( 'assert' )
  , events = require( 'events' )
  , commentSingle = new RegExp( '\/\/.*\n?', 'g' )
  , commentMultiple = new RegExp( '\/\\*.*?\\*\/', 'mg' )
  , include = new RegExp( '#.*include.*\n?', 'g' )
  , defineNewLine = new RegExp( '\\\\[ \t]*\n', 'mg' )
  , define = new RegExp( '#.*define.*\s*\n?', 'g' )
  , undefine = new RegExp( '#.*undef.*\n?', 'mg' )
  , stringLiteral = new RegExp( '".*?([^\\\\]")', 'g' )
  , arrayInitBlock = RegExp( '\\s*=.*?;', 'g' )
  , Forwarder = require( './builder/forwarder').Forwarder;
  
assert( typeof Forwarder !== 'undefined' );

exports.stripArrayInitializerBlocks = function( code ) {
  code = code.replace( arrayInitBlock, ';' );
  return code;
};
  
exports.stripStrings = function( code ) { 
  code = code.replace( stringLiteral, '' );
  return code;
};

exports.stripDefines = function( code ) {
  code = code.replace( defineNewLine, '' );
  code = code.replace( define, '' );
  code = code.replace( undefine, '' );
  return code;
};

exports.stripIncludes = function( code ) {
  code = code.replace( include, '' );
  return code;
}; 

exports.stripComments = function( code ) {
  code = code.replace( commentSingle, '' );
  code = code.replace( commentMultiple, '' );
  return code;
};

exports.forward = function( code, done ) { 
    var emitter = new events.EventEmitter()
      , parser = new Parser()
      , builder = new Forwarder( emitter );
  
  emitter.on( 'forward declare', function( types ) {
    done( types );
  } );

  parser.process( 'code', emitter );
}
	