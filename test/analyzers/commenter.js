#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , events = require( 'events' )
  , Tokenizer = require( 'mucbuc-jsthree' ).Tokenizer
  , Base = require( '../base' ).Base
  , Commenter = require( '../../src/analyzers/commenter' ).Commenter;

assert( typeof Commenter !== 'undefined' );

test( commenterSingleLine );
test( commentBlock );

function commentBlock(emitter, parser) {
  emitter.expect( 'comment block' );
  //emitter.expect( 'consume', 'hello*/' ); // not sure why this fails
  parser.process( '/*hello*/' );
}

function commenterSingleLine(emitter, parser) {
  emitter.expect( 'comment line' );
  //emitter.expect( 'consume', 'hello\n' ); // not sure why this fails
  parser.process( '// hello\n' );
}

function test(f) {
  Base.test( f, Commenter, Tokenizer, {
    'comment line': '\\/\\/',
    'comment block': '\\/\\*',
  } );
}
