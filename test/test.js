#!/usr/bin/env node

var assert = require( 'assert' )
  , cp = require( 'child_process' )
  , Base = require( './base' ).Base
  , test = Base.test;

runTest();

function runTest() {

  process.setMaxListeners( 0 );
  
  cp.fork( './analyzers/scoper' );
  cp.fork( './analyzers/definer' ); 
  cp.fork( './analyzers/declarer' );
  cp.fork( './analyzers/template' );
//  cp.fork( 'factory' );
  cp.fork( 'builder' );
  cp.fork( 'squint' );
  
  function forwardDeclarations(emitter) {
    squint.forward( 'struct hello {};', function( result ) {
      assert( result.trim() == 'struct hello' );
      emitter.emit( 'end' );
    } );
  }
}