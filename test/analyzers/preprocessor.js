#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , Base = require( '../base' ).Base
  , events = require( 'events' )
  , Preprocessor = require( '../../src/analyzers/preprocessor' ).Preprocessor; 

assert( typeof Preprocessor !== 'undefined' );

test( preprocessorSingleLine );
test( preprocessorMultiLine );

function preprocessorMultiLine(emitter, parser) {
	emitter.expect( 'preprocess', '#define hello hello\\n\hello\n' );
	parser.process( '#define hello hello\\nhello\n' ); 
}

function preprocessorSingleLine(emitter, parser) {
	emitter.expect( 'preprocess', '#define hello hello\n' );
	parser.process( '#define hello hello\n' ); 
}

function test(f) {
	Base.test( f, Preprocessor );
}