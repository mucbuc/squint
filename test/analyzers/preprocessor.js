#!/usr/bin/env node

var assert = require( 'assert' )
  , Base = require( '../base' ).Base
  , events = require( 'events' )
  , Preprocessor = require( '../../src/analyzers/preprocessor' ).Preprocessor; 

assert( typeof Preprocessor !== 'undefined' );

test( preprocessor );

function preprocessor(emitter, parser) {
	emitter.expect( 'preprocess', '#define hello hello\n' );
	parser.process( '#define hello hello\n' ); 
}

function test(f) {
	Base.test( f, Preprocessor );
}