#!/usr/bin/env node

var assert = require( 'assert' )
  , Base = require( '../base' ).Base
  , Tokenizer = require( 'mucbuc-jsthree' ).Tokenizer
  , Literalizer = require( '../../src/analyzers/literalizer.js').Literalizer
  , rules = { 'open literal': '([^//]"|^")' }; 

assert( typeof Literalizer === 'function' );

Base.test_2( stringLiteral, rules, Tokenizer );
Base.test_2( stringLiteralWithQutationMarks, rules, Tokenizer );

function stringLiteralWithQutationMarks(emitter, process) {
  var literalizer = new Literalizer( emitter ); 

  emitter.expectNot( 'declare' ); 
  emitter.expect( 'open literal' );
  process( '"struct he/"llo;"' );
}

function stringLiteral(emitter, process) {
  var literalizer = new Literalizer( emitter ); 

  emitter.expectNot( 'declare' ); 
  emitter.expect( 'open literal' );
  process( '"struct hello;"' );
}
