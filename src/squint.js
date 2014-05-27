var assert = require( 'assert' )
  , Builder = require( './builder' ).Builder
  , Forward = require( './factories/forward' ).Forward
  , Header = require( './factories/header' ).Header
  , Implement = require( './factories/implement' ).Implement
  , TemplateHeader = require( './factories/template_header' ).TemplateHeader
  , Compiler = require( './analyzers/compiler' ).Compiler
  , regexMap = require( './regexmap' ).regexMap;

assert( typeof Forward !== 'undefined' );

var Squint = {

  stripTypedefs: function( code ) {
    code = code.replace( regexMap.typeDef, '' );
    return code;
  },

  stripArrayInitializerBlocks: function( code ) {
    code = code.replace( regexMap.arrayInitBlock, ';' );
    return code;
  },

  stripStrings: function( code ) { 
    code = code.replace( regexMap.stringLiteral, '' );
    return code;
  },

  stripPreprocessor: function( code ) {
    code = code.replace( regexMap.preProcessorLine, '' );
    return code;
  },

  stripDefines: function( code ) {
    code = code.replace( regexMap.defineNewLine, '' );
    code = code.replace( regexMap.define, '' );
    code = code.replace( regexMap.undefine, '' );
    return code;
  },

  stripIncludes: function( code ) {
    code = code.replace( regexMap.include, '' );
    return code;
  },

  stripComments: function( code ) {
    code = code.replace( regexMap.commentSingle, '' );
    code = code.replace( regexMap.commentMultiple, '' );
    return code;
  },

  compile: function( code, emitter ) {
    var parser = new Compiler( emitter );
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
