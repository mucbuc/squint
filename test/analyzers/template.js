#!/usr/bin/env node

var assert = require( 'assert' )
  , Base = require( '../base' ).Base
  , Scoper = require( '../../src/analyzers/scoper' ).Scoper
  , Template = require( '../../src/analyzers/template' ).Template
  , rules = { 'open': '{', 'statement': ';' };

process.setMaxListeners( 0 );

test( singleParameter );
test( multipleParameters );
test( macroParameters );
test( templateNestedParameters );

function templateNestedParameters(emitter, parser) {

	console.log( "** templateNestedParameters disabled ** ");
	return;

	var templater = new Template( emitter );

	emitter.expect( 'template parameters', 'template<typename>, template<typename>' );
	parser.process( 'template< template< typename >, template< typename > >;', rules );
}

function macroParameters(emitter, parser) {

	console.log( "** macroParameters disabled ** ");
	return;

	var templater = new Template( emitter );

	emitter.expect( 'template parameters', 'MACRO(), MACRO' );
	parser.process( 'template< MACRO(), MACRO >;', rules );

	emitter.expect( 'template parameters', 'MACRO(ARG), MACRO()' );
	parser.process( 'template< MACRO(ARG), MACRO() >;', rules );

	emitter.expect( 'template parameters', 'MACRO(), MACRO' );
	parser.process( 'template< MACRO(), MACRO >', rules );
}

function multipleParameters(emitter, parser) {
	var templater = new Template( emitter );
	
	emitter.expect( 'template parameters', 'class A, class B' );
	parser.process( 'template< class A, class B>;', rules );

	emitter.expect( 'template parameters', 'class A, class B' );
	parser.process( 'template< class A, class B>{', rules );

	emitter.expect( 'template parameters', 'class A, class B' );
	parser.process( 'template< class A, class B> text;', rules );

	emitter.expect( 'template parameters', 'class A, class B' );
	parser.process( 'template< class A, class B> text{', rules );

	emitter.expect( 'template parameters', 'class A, class B' );
	parser.process( 'template< class A, class B> void text( A a );', rules );

	emitter.expect( 'template parameters', 'class A, class B' );
	parser.process( 'template< class A, class B> void text( A a ) {', rules );
}

function singleParameter(emitter, parser) {
	var templater = new Template( emitter );

	emitter.expect( 'template parameters', 'class A' );
	parser.process( 'template<class A>{', rules );

	emitter.expect( 'template parameters', 'class A' );
	parser.process( 'template<class A>;', rules );

	emitter.expect( 'template parameters', 'class A' );
	parser.process( 'template<class A> text text {', rules );

	emitter.expect( 'template parameters', 'class A' );
	parser.process( 'template<class A> text text;', rules );

	emitter.expect( 'template parameters', 'class A' );
	parser.process( 'template<class A> void text( A a ) {', rules );

	emitter.expect( 'template parameters', 'class A' );
	parser.process( 'template<class A> void text( A a );', rules );
}

function test(f) {
	Base.test( f, Scoper );
}

