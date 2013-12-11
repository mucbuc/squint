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
  , Builder = require( './builder' ).Builder
  , Forward = require( './factories/forward' ).Forward
  , Header = require( './factories/header' ).Header
  , Implement = require( './factories/implement' ).Implement
  , TemplateHeader = require( './factories/template_header' ).TemplateHeader
  , Compiler = require( './analyzers/compiler' ).Compiler;

assert( typeof Forward !== 'undefined' );

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
    , parser = new Compiler( emitter );

  emitter.once( 'compile', function( model ) {
    var builder = new Builder( model );
    done( builder.build( new Forward() ) );
  } );

  parser.process( code, emitter );
};

exports.declare = function( code, done ) { 
  var emitter = new events.EventEmitter()
    , parser = new Compiler( emitter );

  emitter.once( 'compile', function( model ) {
    var builder = new Builder( model );
    done( builder.build( new Header() ) );
  } );

  parser.process( code, emitter );
};

exports.templateDeclare = function( code, done ) { 
  var emitter = new events.EventEmitter()
    , parser = new Compiler( emitter );

  emitter.once( 'compile', function( model ) {
    var builder = new Builder( model );
    done( builder.build( new TemplateHeader() ) );
  } );

  parser.process( code, emitter );
};

exports.define = function( code, done ) { 
  var emitter = new events.EventEmitter()
    , parser = new Compiler( emitter );

  emitter.once( 'compile', function( model ) {
    var builder = new Builder( model );
    done( builder.build( new Implement() ) );
  } );

  parser.process( code, emitter );
};
  