#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../../src/analyzers/scoper').Scoper
  , Base = require( '../base' ).Base
  , Test = require( 'mucbuc-jsthree' ).Test;

assert( typeof Scoper !== 'undefined' );

test( basicScope );
test( nestedScopes );
test( aggregateScopes );
test( alternativeScopeTag ); // , Scoper, Tokenizer, { 'open': '<', 'close': '>' }, '<' );

function alternativeScopeTag(emitter, parser) {
  var rules = { 'open': '<', 'close': '>' };

  emitter.expect( 'open scope', 'template' );
  emitter.expect( 'close scope', 'typename' );
  parser.process( 'template< typename >', rules );

  // emitter.expect( 'open scope', 'template' );
  // emitter.expect( 'close scope', 'template<typename>' );
  // parser.process( 'template< template< typename > >', rules );
}

function aggregateScopes( emitter, parser ) {

  emitter.expect( 'open scope', 'namespace outside' );
  emitter.expect( 'close scope', 'namespace inside1{}namespace inside2{}' );
  emitter.expect( 'end' );
  parser.process( 'namespace outside{ namespace inside1 {} namespace inside2 {} }' );
}

function nestedScopes(emitter, parser) {

  emitter.expect( 'open scope', 'namespace hello' );
  emitter.expect( 'close scope', 'namespace world{namespace{}}' );
  emitter.expect( 'end' );
  parser.process( 'namespace hello{ namespace world{ namespace {} } }' );
}

function basicScope(emitter, parser) {

  emitter.expect( 'open scope', 'namespace bla' );
  emitter.expect( 'close scope', '' );
  parser.process( 'namespace bla {}' );

  emitter.expect( 'open scope', 'namespace bla' );
  emitter.expect( 'close scope', 'hello;' );
  parser.process( 'namespace bla { hello; }' );

  emitter.expect( 'open scope', 'namespace bla' );
  emitter.expect( 'close scope', 'hello' );
  parser.process( 'namespace bla { hello }' );
}

function test(f) {
  Base.test( f, Scoper );
}
