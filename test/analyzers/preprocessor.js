#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , events = require( 'events' )
  , Tokenizer = require( 'mucbuc-jsthree' ).Tokenizer
  , Base = require( '../base' ).Base
  , Preprocessor = require( '../../src/analyzers/preprocessor' ).Preprocessor;

assert( typeof Preprocessor !== 'undefined' );

test( preprocessorSingleLine );
test( preprocessorMultiLine );
test( preprocessorMultiple );
test( preprocessorAfterComment );

function preprocessorAfterComment(emitter, parser) {
	emitter.expect( 'preprocess' ); // consume =>, '#define BLA\n' );
	parser.process( '/*yo*/ #define BLA\n');
}

function preprocessorMultiple(emitter, parser) {
	emitter.expect( 'preprocess' ); // consume =>, '#define A\n' );
	emitter.expect( 'preprocess' ); // consume =>, '#define B\n' );
	parser.process( '#define A\n#define B\n' );
}

function preprocessorMultiLine(emitter, parser) {
	emitter.expect( 'preprocess' ); // consume =>, '#define hello hello\\\nhello\n' );
	parser.process( '#define hello hello\\\nhello\nbla' );
}

function preprocessorSingleLine(emitter, parser) {
	emitter.expect( 'preprocess' );
	//emitter.expect( 'consume', '#define hello hello\n' );
  parser.process( '#define hello hello\nasdfaasdf\nbla' );
}

function test(f) {
	Base.test( f, Preprocessor, Tokenizer, { 'preprocess': '#' } );
}
