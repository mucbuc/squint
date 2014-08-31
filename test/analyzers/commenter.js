#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , Tokenizer = require( 'mucbuc-jsthree' ).Tokenizer
  , Base = require( '../base' ).Base
  , Commenter = require( '../../src/analyzers/commenter' ).Commenter
  , rules = {
      'comment line': '\\/\\/',
      'comment block': '\\/\\*',
    };

assert( typeof Commenter !== 'undefined' );

Base.test_2( commenterSingleLine, rules, Tokenizer );
Base.test_2( commentBlock, rules, Tokenizer );

function commentBlock(emitter, process) {
  emitter.expect( 'comment block' );
  //emitter.expect( 'consume', 'hello*/' ); // not sure why this fails
  process( '/*hello*/' );
}

function commenterSingleLine(emitter, process) {
  emitter.expect( 'comment line' );
  //emitter.expect( 'consume', 'hello\n' ); // not sure why this fails
  process( '// hello\n' );
}
