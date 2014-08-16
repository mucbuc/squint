#!/usr/bin/env node

var assert = require( 'assert' )
  , fluke = require( 'flukejs' )
  , Test = require( 'mucbuc-jsthree' ).Test
  , Scoper = require( '../../src/analyzers/scoper').Scoper
  , Base = require( '../base' ).Base
  , Test = require( 'mucbuc-jsthree' ).Test;

assert( typeof Scoper !== 'undefined' );

test( basicScope, { 'open': '{', 'close': '}' } );
test( nestedScopes, { 'open': '{', 'close': '}' } );
test( aggregateScopes, { 'open': '{', 'close': '}' } );
test( alternativeScopeTag, { 'open': '<', 'close': '>' } ); 

function alternativeScopeTag(emitter, process) {
  emitter.expect( 'open scope', 'template' );
  emitter.expect( 'close scope', 'typename' );
  process( 'template< typename >' );

  emitter.expect( 'open scope', 'template' );
  emitter.expect( 'close scope', 'template<typename>' );
  process( 'template< template< typename > >' );
}

function aggregateScopes( emitter, process ) {

  emitter.expect( 'open scope', 'namespace outside' );
  emitter.expect( 'close scope', 'namespace inside1{}namespace inside2{}' );
  emitter.expect( 'end' );
  process( 'namespace outside{ namespace inside1 {} namespace inside2 {} }' );
}

function nestedScopes(emitter, process) {

  emitter.expect( 'open scope', 'namespace hello' );
  emitter.expect( 'close scope', 'namespace world{namespace{}}' );
  emitter.expect( 'end' );
  process( 'namespace hello{ namespace world{ namespace {} } }' );
}

function basicScope(emitter, process) {

  emitter.expect( 'open scope', 'namespace bla' );
  emitter.expect( 'close scope', '' );
  process( 'namespace bla {}' );

  emitter.expect( 'open scope', 'namespace bla' );
  emitter.expect( 'close scope', 'hello;' );
  process( 'namespace bla { hello; }' );

  emitter.expect( 'open scope', 'namespace bla' );
  emitter.expect( 'close scope', 'hello' );
  process( 'namespace bla { hello }' );
}

function test(f, rules ) {
  var emitter = new Test.Emitter
    , scoper = new Scoper( emitter, splitNext );
  
  f( emitter, splitNext );
  process.on( 'exit', function() {
    console.log( f.name + ' passed' );
  });

  function splitNext( code ) {
    fluke.splitNext( code, function(type, lhs, rhs, token) {
        emitter.emit(type, lhs, rhs, token);
      }
      , rules ); 
  }
}
