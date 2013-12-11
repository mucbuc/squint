var assert = require( 'chai' ).assert 
  , events = require( 'events' )
  , Builder = require( '../src/builder' ).Builder
  , Factory = require( '../src/factories/factory' ).Factory
  , Implement = require( '../src/factories/implement' ).Implement
  , Header = require( '../src/factories/header' ).Header
  , Compiler = require( '../src/analyzers/compiler' ).Compiler
  , Base = require( './base' ).Base;

assert( typeof Builder !== 'undefined' ); 

process.setMaxListeners( 0 );

testBuilder(); 

function testBuilder() {

  test( builderBuildNestedNamespaces );
  test( builderBuildNestedTypes );
  test( builderBuildMemberFunctions );
  test( builderBuildNamespaceFunction ); 

  function builderBuildNamespaceFunction(emitter, parser) {
    emitter.once( 'compile', function(model) {
      var builder = new Builder( model )
        , result = builder.build( new Header() );
      assert.match( result, /\s*namespace\s+bla\s*{\s*void\s+foo\s*\(\s*\)\s*;\s*}.*/ );
    } );
    parser.process( 'namespace bla{ void foo(); }', emitter );
  }

  function builderBuildMemberFunctions(emitter, parser) {
    emitter.once( 'compile', function( model ) {
      var builder = new Builder( model )
        , result = builder.build( new Header() );
      assert.match( result, /\s*struct\s+bla\s*{\s*void\s+foo\s*\(\s*\)\s*;\s*};/ );

      result = builder.build( new Implement() );
      assert.match( result, /\s*void\s+bla::foo\s*\(\s*\)\s*{\s*}/ );
    } );
    parser.process( 'struct bla { void foo(); };', emitter );

    emitter.once( 'compile', function( model ) {
      var builder = new Builder( model )
        , result = builder.build( new Implement() );
      assert.match( result, /\s*void\s+bla::foo\s*\(\s*\)\s*{\s*}/ );
    } );
    parser.process( 'class bla { void foo(); };', emitter );
  } 

  function builderBuildNestedTypes(emitter, parser) {
    emitter.once( 'compile', function( model ) {
      var builder = new Builder( model )
        , result = builder.build( new Header() );
      
      assert.match( result, /\s*struct\s+outside\s*{\s*struct\s+inside\s*{\s*};\s*};/ );
    } );
    parser.process( 'struct outside { struct inside{}; };', emitter );
  }

  function builderBuildNestedNamespaces(emitter, parser){
    emitter.once( 'compile', function( model ) {
      var builder = new Builder( model )
        , result = builder.build( new Factory() );
      result = builder.build( new Factory() );
      assert.match( result, /\s*namespace\s+outside\s*{\s*namespace\s+inside\s*{\s*}.*\s*}.*/ );
    } );
    parser.process( 'namespace outside{ namespace inside {} }', emitter );
  }

  function test(f) {
    Base.test( f, Compiler );
  }
}