#!/usr/bin/env node

var assert = require( 'assert' )
  , Base = require( '../base' ).Base
  , Declarer = require( '../../src/analyzers/declarer' ).Declarer;

assert( typeof Declarer !== 'undefined' );

testDeclarer();

function testDeclarer() {

  test( declareType );
  test( declareFunction );
  test( declareNot );
  test( ignoreSubScopes );
  //test( defineTypedef );
  test( declareTypeAfterPreproesorDirective ); 
  test( declareTypeAfterPreproesorDirectives ); 

  function declareTypeAfterPreproesorDirectives( emitter, parser ) {
    emitter.expectNot( 'define type' );

    emitter.expect( 'declare type', 'struct bla' );
    parser.process( '#define hello asd\n#define hello\\nasdfasd\nstruct bla;' );
  }
  
  function declareTypeAfterPreproesorDirective( emitter, parser ) {
    emitter.expectNot( 'define type' );

    emitter.expect( 'declare type', 'struct bla' );
    parser.process( '#define hello asd\nstruct bla;' );
  }
  
  function defineTypedef(emitter, parser) {
    emitter.expect( 'define typedef', { name: 'temp', code: 'typedef string string_type;' } );
    parser.process( 'typedef string string_type;' ); 
  }

  function ignoreSubScopes(emitter, parser) {
    emitter.expectNot( 'declare type' );
    parser.process( 'namespace { struct hello; }' );
  }

  function declareNot(emitter, parser) {
    emitter.expectNot( 'declare function' );
    parser.process( 'bla bla;' );
    parser.process( 'bla += bla();' );
  }

  function declareFunction( emitter, parser ) {
    emitter.expectNot( 'define function' );
    emitter.expect( 'declare function', 'void foo()' );
    parser.process( 'void foo();' );
  }

  function declareType( emitter, parser ) {
    emitter.expectNot( 'define type' );
    
    emitter.expect( 'declare type', 'struct bla' );
    parser.process( 'struct bla;' );
  }
} 

function test(f) {
  Base.test( f, Declarer ); }