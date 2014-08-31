#!/usr/bin/env node

var assert = require( 'assert' )
  , Base = require( '../base' ).Base
  , Scoper = require( '../../src/analyzers/scoper' ).Scoper
  , Template = require( '../../src/analyzers/template' ).Template
  , rules = { 'open': '{', 'statement': ';' };

process.setMaxListeners( 0 );

Base.test_2( singleParameter, rules, Scoper );
//	Base.test_2( multipleParameters );
// test( macroParameters );
// test( templateNestedParameters );

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

function singleParameter(emitter, process) {
	var templater = new Template( emitter );

	emitter.expect( 'template parameters', 'class A' );
	process( 'template<class A>{' );

	// emitter.expect( 'template parameters', 'class A' );
	// process( 'template<class A>;' );

	// emitter.expect( 'template parameters', 'class A' );
	// process( 'template<class A> text text {' );

	// emitter.expect( 'template parameters', 'class A' );
	// process( 'template<class A> text text;' );

	// emitter.expect( 'template parameters', 'class A' );
	// process( 'template<class A> void text( A a ) {' );

	// emitter.expect( 'template parameters', 'class A' );
	// process( 'template<class A> void text( A a );' );
}

function test(f) {
	Base.test( f, Scoper );
}

