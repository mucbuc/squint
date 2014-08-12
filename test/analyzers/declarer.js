#!/usr/bin/env node

var assert = require( 'assert' )
  , Base = require( '../base' ).Base
  , Scoper = require( '../../src/analyzers/scoper' ).Scoper
  , Declarer = require( '../../src/analyzers/declarer' ).Declarer;

assert( typeof Declarer !== 'undefined' );

test( declareType );
test( declareFunction );
test( declareNot );
test( ignoreSubScopes );

function ignoreSubScopes(emitter, parser) {
  var declarer = new Declarer( emitter ); 
  emitter.expectNot( 'declare type' );
  parser.process( 'namespace { struct hello; }', defaultMap() );
}

function declareNot(emitter, parser) {
  var declarer = new Declarer( emitter );
  emitter.expectNot( 'declare function' );
  parser.process( 'bla bla;' );
  parser.process( 'bla += bla();', defaultMap() );
}

function declareFunction( emitter, parser ) {
  var declarer = new Declarer( emitter );
  emitter.expectNot( 'define function' );
  emitter.expect( 'declare function', 'void foo()' );
  parser.process( 'void foo();', defaultMap() );
}

function declareType( emitter, parser ) {
  var declarer = new Declarer( emitter );
  emitter.expectNot( 'define type' );
  emitter.expect( 'declare type', 'struct bla' );
  parser.process( 'struct bla;', defaultMap() );
}

function defaultMap() {
  return {
    //'statement': ';',
    'open': '{',
    'close': '}',
  };
}

function test(f) {
  Base.test( f, Scoper );
}
