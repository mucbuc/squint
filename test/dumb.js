#!/usr/bin/env node

var assert = require( 'assert' )
  , Expector = require( 'Expector' ).Expector
  , Analyzer = require( 'jargon' )
  , fs = require( 'fs' );

assert( typeof Analyzer !== 'undefined' );
    
suite( "hello", function() {

  var emitter;
  setup(function() {
    emitter = new Expector;
    emitter.setMaxListeners( 0 );
  });

  teardown(function() {
    emitter.check(); 
    delete emitter;
  }); 

  test( "test.h", function() {
    var data = fs.readFileSync( './test/samples/test.h' )
      , analyzer = new Analyzer( emitter );
    emitter
      .expect( 'preprocess' )
      .repeat( 1 );
    analyzer.split( data.toString() );
  });
}); 