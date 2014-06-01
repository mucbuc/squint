#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , events = require( 'events' )
  , Tokenizer = require( 'mucbuc-jsthree' ).Tokenizer
  , Base = require( '../base' ).Base
  , Preprocessor = require( '../../src/analyzers/preprocessor' ).Preprocessor;

assert( typeof Preprocessor !== 'undefined' );

// test( preprocessorSingleLine );
// test( preprocessorMultiLine );
// test( preprocessorMultiple );
// test( preprocessorAfterComment );
test( preprocessorComment );

function preprocessorComment(emitter, parser) {
	emitter.expect( 'comment' );
	//emitter.expect( 'end', 'hello\n' );
  parser.process( '// hello\n' );
}

function preprocessorAfterComment(emitter, parser) {
	emitter.expect( 'preprocess', '#define BLA\n' );
	parser.process( '/*yo*/ #define BLA\n');
}

function preprocessorMultiple(emitter, parser) {
	emitter.expect( 'preprocess', '#define A\n' );
	emitter.expect( 'preprocess', '#define B\n' );
	parser.process( '#define A\n#define B\n' );
}

function preprocessorMultiLine(emitter, parser) {
	emitter.expect( 'preprocess', '#define hello hello\\\nhello\n' );
	parser.process( '#define hello hello\\\nhello\nbla' );
}

function preprocessorSingleLine(emitter, parser) {
	emitter.expect( 'preprocess', '#define hello hello\n' );
	parser.process( '#define hello hello\nasdfaasdf\nbla' );
}

function test(f) {
	Base.test( f, Preprocessor, Tokenizer, { 'comment': '\\/\\/' } );
}
