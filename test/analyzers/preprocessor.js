#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , Base = require( '../base' ).Base
  , events = require( 'events' )
  , Preprocessor = require( '../../src/analyzers/preprocessor' ).Preprocessor; 

assert( typeof Preprocessor !== 'undefined' );

test( preprocessorSingleLine );
test( preprocessorMultiLine );

function preprocessorMultiLine(emitter, parser) {
	var remainder; 
	emitter.expect( 'preprocess', '#define hello hello\\\nhello\n' );
	remainder = parser.process( '#define hello hello\\\nhello\nbla' );
	assert( remainder === 'bla' );
}

function preprocessorSingleLine(emitter, parser) {
	var remainder; 

	emitter.expect( 'preprocess', '#define hello hello\n' );
	remainder = parser.process( '#define hello hello\nasdfaasdf\nbla' ); 
	assert( remainder === 'asdfaasdf\nbla' );
}

function test(f) {
	Base.test( f, Preprocessor );
}

