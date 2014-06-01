#!/usr/bin/env node

var assert = require( 'assert' )
  , cp = require( 'child_process' )
  , Base = require( './base' ).Base
  , test = Base.test;

runTest();

function runTest() {

  process.setMaxListeners( 0 );

  cp.fork( './analyzers/analyzers' );
  // cp.fork( './factory' );
  // cp.fork( './builder' );
  // cp.fork( './squint' );
}
