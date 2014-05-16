var assert = require( 'assert' )
  , events = require( 'events' )
  , commentSingle = new RegExp( '\/\/.*\n?', 'g' )
  , commentMultiple = /\/\*[\s\S]*?\*\//mg
  , include = new RegExp( '#.*include.*\n?', 'g' )
  , defineNewLine = new RegExp( '\\\\[ \t]*\n', 'mg' )
  , define = new RegExp( '#.*define.*\s*\n?', 'g' )
  , undefine = new RegExp( '#.*undef.*\n?', 'mg' )
  , stringLiteral = new RegExp( '".*?([^\\\\]")', 'g' )
  , arrayInitBlock = RegExp( '\\s*=.*?;', 'g' )
  , preProcessorLine = /^\s*#.*/g
  , Builder = require( './builder' ).Builder
  , Forward = require( './factories/forward' ).Forward
  , Header = require( './factories/header' ).Header
  , Implement = require( './factories/implement' ).Implement
  , TemplateHeader = require( './factories/template_header' ).TemplateHeader
  , Compiler = require( './analyzers/compiler' ).Compiler;

assert( typeof Forward !== 'undefined' );

var Squint = { 
  stripArrayInitializerBlocks: function( code ) {
    code = code.replace( arrayInitBlock, ';' );
    return code;
  },

  stripStrings: function( code ) { 
    code = code.replace( stringLiteral, '' );
    return code;
  },

  stripProprocessor: function( code ) {
    code = code.replace( preProcessorLine, '' );
    return code;
  },

  stripDefines: function( code ) {
    code = code.replace( defineNewLine, '' );
    code = code.replace( define, '' );
    code = code.replace( undefine, '' );
    return code;
  },

  stripIncludes: function( code ) {
    code = code.replace( include, '' );
    return code;
  },

  stripComments: function( code ) {
    code = code.replace( commentSingle, '' );
    code = code.replace( commentMultiple, '' );
    return code;
  },

  compile: function( code, done ) {
    var emitter = new events.EventEmitter()
      , parser = new Compiler( emitter );

    emitter.once( 'compile', function( model ) {
      done( model );
    } );
  
    parser.process( code, emitter );
  }, 

  forward: function( model, done ) { 
    var builder = new Builder( model );
    done( builder.build( new Forward() ) );
  },

  declare: function( model, done ) {
    var builder = new Builder( model );
    done( builder.build( new Header() ) );
  },

  templateDeclare: function( model, done ) { 
    var builder = new Builder( model );
    done( builder.build( new TemplateHeader() ) );
  },

  define: function( model, done ) { 
    var builder = new Builder( model );
    done( builder.build( new Implement() ) );
  }
};

for (var p in Squint) {
  exports[p] = Squint[p];
}
