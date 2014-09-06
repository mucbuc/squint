#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , events = require( 'events' )
  , Tokenizer = require( 'mucbuc-jsthree' ).Tokenizer
  , Base = require( '../base' ).Base
  , Scoper = require( '../../src/analyzers/scoper' ).Scoper
  , Preprocessor = require( '../../src/analyzers/preprocessor' ).Preprocessor
  , rules = { 'preprocess': '#' };

assert( typeof Preprocessor !== 'undefined' );

Base.test_2( preprocessorSingleLine, rules, Scoper );
Base.test_2( preprocessorMultiLine, rules, Scoper );
Base.test_2( preprocessorMultiple, rules, Scoper );
Base.test_2( preprocessorAfterComment, rules, Scoper );

function preprocessorAfterComment(emitter, process) {
	emitter.expect( 'preprocess' ); // consume =>, '#define BLA\n' );
	process( '/*yo*/ #define BLA\n');
}

function preprocessorMultiple(emitter, process) {
	emitter.expect( 'preprocess' ); // consume =>, '#define A\n' );
	emitter.expect( 'preprocess' ); // consume =>, '#define B\n' );
	process( '#define A\n#define B\n' );
}

function preprocessorMultiLine(emitter, process) {
	emitter.expect( 'preprocess' ); // consume =>, '#define hello hello\\\nhello\n' );
	process( '#define hello hello\\\nhello\nbla' );
}

function preprocessorSingleLine(emitter, process) {
	emitter.expect( 'preprocess' );
  //emitter.expect( 'consume', '#define hello hello\n' );
  process( '#define hello hello\nasdfaasdf\nbla' );
}

