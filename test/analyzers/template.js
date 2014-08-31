#!/usr/bin/env node

var assert = require( 'assert' )
  , Base = require( '../base' ).Base
  , Scoper = require( '../../src/analyzers/scoper' ).Scoper
  , Template = require( '../../src/analyzers/template' ).Template
  , rules = { 'open': '{', 'statement': ';' };

process.setMaxListeners( 0 );

Base.test_2( singleParameter, rules, Scoper );
Base.test_2( multipleParameters, rules, Scoper );
Base.test_2( macroParameters, rules, Scoper );
Base.test_2( templateNestedParameters, rules, Scoper );

function templateNestedParameters(emitter, process) {

	console.log( "** templateNestedParameters disabled ** ");
	return;

	var templater = new Template( emitter );

	emitter.expect( 'template parameters', 'template<typename>, template<typename>' );
	process( 'template< template< typename >, template< typename > >;' );
}

function macroParameters(emitter, process) {

	var templater = new Template( emitter );

	emitter.expect( 'template parameters', 'MACRO(), MACRO' );
	process( 'template< MACRO(), MACRO >;' );

	emitter.expect( 'template parameters', 'MACRO(ARG), MACRO()' );
	process( 'template< MACRO(ARG), MACRO() >;' );

	emitter.expect( 'template parameters', 'MACRO(), MACRO' );
	process( 'template< MACRO(), MACRO >;' );
}

function multipleParameters(emitter, process) {
	var templater = new Template( emitter );
	
	emitter.expect( 'template parameters', 'class A, class B' );
	process( 'template< class A, class B>;' );

	emitter.expect( 'template parameters', 'class A, class B' );
	process( 'template< class A, class B>{' );

	emitter.expect( 'template parameters', 'class A, class B' );
	process( 'template< class A, class B> text;' );

	emitter.expect( 'template parameters', 'class A, class B' );
	process( 'template< class A, class B> text{' );

	emitter.expect( 'template parameters', 'class A, class B' );
	process( 'template< class A, class B> void text( A a );' );

	emitter.expect( 'template parameters', 'class A, class B' );
	process( 'template< class A, class B> void text( A a ) {' );
}

function singleParameter(emitter, process) {
	var templater = new Template( emitter );

	emitter.expect( 'template parameters', 'class A' );
	process( 'template<class A>{' );

	emitter.expect( 'template parameters', 'class A' );
	process( 'template<class A>;' );

	emitter.expect( 'template parameters', 'class A' );
	process( 'template<class A> text text {' );

	emitter.expect( 'template parameters', 'class A' );
	process( 'template<class A> text text;' );

	emitter.expect( 'template parameters', 'class A' );
	process( 'template<class A> void text( A a ) {' );

	emitter.expect( 'template parameters', 'class A' );
	process( 'template<class A> void text( A a );' );
}

function test(f) {
	Base.test( f, Scoper );
}

