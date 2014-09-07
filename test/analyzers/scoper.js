#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../../src/analyzers/scoper').Scoper
  , Base = require( '../base' ).Base
  , defaultRules = { 'open': '{', 'close': '}' };

assert( typeof Scoper !== 'undefined' );

Base.test_2( basicScope, defaultRules, Scoper );
Base.test_2( nestedScopes, defaultRules, Scoper );
Base.test_2( aggregateScopes, defaultRules, Scoper );
Base.test_2( alternativeScopeTag, { 'open': '<', 'close': '>' }, Scoper ); 

function alternativeScopeTag(emitter, next) {

  emitter.expect( 'open scope', 'template' );
  emitter.expect( 'close scope', 'typename' );
  next( 'template< typename >' );

  emitter.expect( 'open scope', 'template' );
  emitter.expect( 'close scope', 'template< typename >' );
  next( 'template< template< typename > >' );
}

function aggregateScopes( emitter, next ) {

  emitter.expect( 'open scope', 'namespace outside' );
  emitter.expect( 'close scope', 'namespace inside1 {} namespace inside2 {}' );
  emitter.expect( 'end' );
  next( 'namespace outside{ namespace inside1 {} namespace inside2 {} }' );
}

function nestedScopes(emitter, next) {

  emitter.expect( 'open scope', 'namespace hello' );
  emitter.expect( 'close scope', 'namespace world{ namespace {} }' );
  emitter.expect( 'end' );
  next( 'namespace hello{ namespace world{ namespace {} } }' );
}

function basicScope(emitter, next) {
  emitter.expect( 'open scope', 'namespace bla' );
  emitter.expect( 'close scope', '' );
  next( 'namespace bla {}' );
  
  emitter.expect( 'open scope', 'namespace bla' );
  emitter.expect( 'close scope', 'hello;' );
  next( 'namespace bla { hello; }' );

  emitter.expect( 'open scope', 'namespace bla' );
  emitter.expect( 'close scope', 'hello' );
  next( 'namespace bla { hello }' );
}
