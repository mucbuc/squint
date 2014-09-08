#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../../src/analyzers/scoper').Scoper
  , Base = require( '../base' ).Base
  , defaultRules = { 'open': '{', 'close': '}' }
  , Expector = require( 'expector' ).Expector
  , fluke = require( 'flukejs' ); 

assert( typeof Scoper !== 'undefined' );

suite( 'scoper', function() {
  
  var emitter
    , tokenizer;

  setup(function() {
    emitter = new Expector;
  });

  teardown(function() {
    emitter.check(); 
    delete emitter;
  }); 

  test( 'basicScope', function() {
    emitter.expect( 'open scope', 'namespace bla' );
    emitter.expect( 'close scope', '' );
    next( 'namespace bla {}', defaultRules );
    
    emitter.expect( 'open scope', 'namespace bla' );
    emitter.expect( 'close scope', 'hello;' );
    next( 'namespace bla { hello; }', defaultRules );

    emitter.expect( 'open scope', 'namespace bla' );
    emitter.expect( 'close scope', 'hello' );
    next( 'namespace bla { hello }', defaultRules );
  });

  test( 'nestedScopes', function() {
    emitter.expect( 'open scope', 'namespace hello' );
    emitter.expect( 'close scope', 'namespace world{ namespace {} }' );
    emitter.expect( 'end' );
    next( 'namespace hello{ namespace world{ namespace {} } }', defaultRules );
  });

  test( 'aggregateScopes', function() {
    emitter.expect( 'open scope', 'namespace outside' );
    emitter.expect( 'close scope', 'namespace inside1 {} namespace inside2 {}' );
    emitter.expect( 'end' );
    next( 'namespace outside{ namespace inside1 {} namespace inside2 {} }', defaultRules );
  });

  test ( 'alternativeScopeTag', function() {
    var rules = { 'open': '<', 'close': '>' };

    emitter.expect( 'open scope', 'template' );
    emitter.expect( 'close scope', 'typename' );
    next( 'template< typename >', rules );

    emitter.expect( 'open scope', 'template' );
    emitter.expect( 'close scope', 'template< typename >' );
    next( 'template< template< typename > >', rules );  
  });   

  function next( code, rules ) {
    var tokenizer = new Scoper( emitter, rules );
    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
      }
      , rules ); 
  }
});