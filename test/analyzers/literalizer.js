#!/usr/bin/env node

var assert = require( 'assert' )
  , Base = require( '../base' ).Base
  , Tokenizer = require( 'mucbuc-jsthree' ).Tokenizer
  , Literalizer = require( '../../src/analyzers/literalizer.js').Literalizer; 

assert( typeof Literalizer === 'function' );

test( stringLiteral );
test( ignorable );

function ignorable( emitter, parser ) {
	emitter.expect( 'ignore' );
	parser.process( '\\"' );
}

function stringLiteral(emitter, parser) {
  emitter.expectNot( 'declare' ); 
  emitter.expect( 'literal' );
  parser.process( '"struct hello;"' );
}

function test(f) {
	Base.test( f, Literalizer, Tokenizer, {
		'literal': '\"',
		'ignore': '\\\"',
	} );
}