#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , events = require( 'events' )
  , Tokenizer = require( 'mucbuc-jsthree' ).Tokenizer
  , Base = require( '../base' ).Base
  , Commenter = require( '../../src/analyzers/commenter' ).Commenter;

assert( typeof Commenter !== 'undefined' );

test( commenterSingleLine );

function commenterSingleLine(emitter, parser) {
  emitter.expect( 'comment' );
  parser.process( '// hello\n' );
}

function test(f) {
  Base.test( f, Commenter, Tokenizer, { 'comment': '\\/\\/' } );
}
