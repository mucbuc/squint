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
//test( aggregateScopes, { 'open': '{', 'close': '}' } );
// test( alternativeScopeTag, { 'open': '<', 'close': '>' } ); 

function alternativeScopeTag(emitter, next) {
  emitter.expect( 'open scope', 'template' );
  emitter.expect( 'close scope', 'typename' );
  next( 'template< typename >' );

  emitter.expect( 'open scope', 'template' );
  emitter.expect( 'close scope', 'template<typename>' );
  next( 'template< template< typename > >' );
}

function aggregateScopes( emitter, next ) {

  emitter.expect( 'open scope', 'namespace outside' );
  emitter.expect( 'close scope', 'namespace inside1{}namespace inside2{}' );
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

function test(f, rules ) {
  var emitter = new Test.Emitter
    , scoper = new Scoper( emitter );
  
  f( emitter, splitAll );
  process.on( 'exit', function() {
    console.log( f.name + ' passed' );
  });

  function splitAll( code ) {
    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
      }
      , rules ); 
  }
}
