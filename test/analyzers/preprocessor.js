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
	parser.process( '#define hello hello\\nhello\nblblb\n' ); 
}

function preprocessorSingleLine(emitter, parser) {
	emitter.expect( 'preprocess', '#define hello hello\n' );
	parser.process( '#define hello hello\nasdfaasdf\n' ); 
}

function test(f) {
	Base.test( f, Preprocessor );
}