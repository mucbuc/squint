#!/usr/bin/env node

var assert = require( 'assert' )
  , Base = require( '../base' ).Base
  , Literalizer = require( '../../src/analyzers/literalizer.js').Literalizer
  , Expector = require( 'expector' ).Expector
  , fluke = require( 'flukejs' )
  , rules = { 'open literal': '([^//]"|^")' }; 

assert( typeof Literalizer === 'function' );

suite( 'literalizer', function() {

  var emitter;
  setup(function() {
    emitter = new Expector;
  });
  
  teardown(function() {
    emitter.check(); 
    delete emitter;
  }); 

  test( 'stringLiteral', function() {
    emitter.expectNot( 'declare' ); 
    emitter.expect( 'open literal' );
    split( '"struct hello;"' );
  });

  test( 'stringLiteralWithQutationMarks', function() {
    emitter.expectNot( 'declare' ); 
    emitter.expect( 'open literal' );
    split( '"struct he/"llo;"' );
  });

  function split( code ) {
    var literalizer = new Literalizer( emitter ); 

    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
      }
      , rules ); 
  }
});
