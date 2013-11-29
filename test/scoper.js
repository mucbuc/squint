var assert = require( 'assert' )
  , Scoper = require( '../src/scoper').Scoper
  , Builder = require( './base' ).Builder;

assert( typeof Scoper !== 'undefined' );

testScoper();

function testScoper() {

	test( basicScope );
	test( nestedScopes );
	// test( anonymousNamespaces );
	// test( nonNamespaces );
	// test( nestedAggregate ); 

	function nestedAggregate( emitter, parser ) { 
		emitter.expect( 'open scope', 'outside' );
		emitter.expect( 'open scope', 'inside1' );
		emitter.expect( 'close scope' );
		emitter.expect( 'open scope', 'inside2' );
		emitter.expect( 'close scope' );
		emitter.expect( 'close scope' );
		parser.process( 'namespace outside{ namespace inside1 {} namespace inside2 {} }', emitter );
	}

	function nestedScopes(emitter, parser) {

		emitter.expectNot( 'open' );
		emitter.expectNot( 'close' );

		emitter.expect( 'open scope', 'namespace hello' );
		//emitter.expect( 'open scope', 'namespace world' );
		// emitter.expect( 'open scope', '' );
		// emitter.expect( 'close scope', '' );
		// emitter.expect( 'close scope', '' );
		emitter.expect( 'close scope', 'namespace world{namespace{}}' );
		parser.process( 'namespace hello{ namespace world{ namespace {} } }', emitter );
	}

	function basicScope(emitter, parser) {
		
		emitter.expectNot( 'open' );
		emitter.expectNot( 'close' );

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
		Builder.test( f, Scoper );
	}
}
