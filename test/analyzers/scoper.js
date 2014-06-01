#!/usr/bin/env node

var assert = require( 'assert' )
  , Tokenizer = require( 'mucbuc-jsthree' ).Tokenizer
  , Scoper = require( '../../src/analyzers/scoper').Scoper
  , Base = require( '../base' ).Base
  , Test = require( 'mucbuc-jsthree' ).Test;

assert( typeof Scoper !== 'undefined' );

testScoper();

function testScoper() {

	test( basicScope );
	test( nestedScopes );
	test( aggregateScopes );
	Base.test( alternativeScopeTag, Scoper, Tokenizer, { 'open': '<', 'close': '>' }, '<' );

	function alternativeScopeTag(emitter, parser) {

		emitter.expect( 'open scope', 'template' );
		emitter.expect( 'close scope', 'typename' );
		parser.process( 'template< typename >' );

		emitter.expect( 'open scope', 'template' );
		emitter.expect( 'close scope', 'template<typename>' );
    parser.process( 'template< template< typename > >' );
	}

	function aggregateScopes( emitter, parser ) {

		emitter.expect( 'open scope', 'namespace outside' );
		emitter.expect( 'close scope', 'namespace inside1{}namespace inside2{}' );
		emitter.expect( 'end' );
    parser.process( 'namespace outside{ namespace inside1 {} namespace inside2 {} }', emitter );
	}

	function nestedScopes(emitter, parser) {

		emitter.expect( 'open scope', 'namespace hello' );
		emitter.expect( 'close scope', 'namespace world{namespace{}}' );
		emitter.expect( 'end' );
    parser.process( 'namespace hello{ namespace world{ namespace {} } }', emitter );
	}

	function basicScope(emitter, parser) {

		emitter.expect( 'open scope', 'namespace bla' );
		emitter.expect( 'close scope', '' );
		parser.process( 'namespace bla {}', emitter );

		emitter.expect( 'open scope', 'namespace bla' );
		emitter.expect( 'close scope', 'hello;' );
		parser.process( 'namespace bla { hello; }', emitter );

		emitter.expect( 'open scope', 'namespace bla' );
		emitter.expect( 'close scope', 'hello' );
		parser.process( 'namespace bla { hello }', emitter );
	}

	function test(f) {
		Base.test( f, Scoper );
	}
}
