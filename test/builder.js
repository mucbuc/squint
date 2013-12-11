var assert = require( 'chai' ).assert 
  , events = require( 'events' )
  , Builder = require( '../src/builder' ).Builder
  , Factory = require( '../src/factories/factory' ).Factory
  , Implement = require( '../src/factories/implement' ).Implement
  , Header = require( '../src/factories/header' ).Header
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
    var result;
    parser.process( 'namespace bla{ void foo(); }' );
    result = parser.build( new Header() );
    assert.match( result, /\s*namespace\s+bla\s*{\s*void\s+foo\s*\(\s*\)\s*;\s*}.*/ );
  }

  function builderBuildMemberFunctions(emitter, parser) {
    var result;
    parser.process( 'struct bla { void foo(); };' );
    result = parser.build( new Header() );
    assert.match( result, /\s*struct\s+bla\s*{\s*void\s+foo\s*\(\s*\)\s*;\s*};/ );

    result = parser.build( new Implement() );
    assert.match( result, /\s*void\s+bla::foo\s*\(\s*\)\s*{\s*}/ );

    parser.process( 'class bla { void foo(); };' );
    result = parser.build( new Implement() );
    assert.match( result, /\s*void\s+bla::foo\s*\(\s*\)\s*{\s*}/ );
  } 

  function builderBuildNestedTypes(emitter, parser) {
    var result;
    parser.process( 'struct outside { struct inside{}; };' );
    result = parser.build( new Header() );
    assert.match( result, /\s*struct\s+outside\s*{\s*struct\s+inside\s*{\s*};\s*};/ );
  }

  function builderBuildNestedNamespaces(emitter, parser){
    var result;
    parser.process( 'namespace outside{ namespace inside {} }', emitter );
    result = parser.build( new Factory() );
    assert.match( result, /\s*namespace\s+outside\s*{\s*namespace\s+inside\s*{\s*}.*\s*}.*/ );
  }

  function test(f) {
    Base.test( f, Builder );
  }
}