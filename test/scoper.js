var assert = require( 'assert' )
  , Builder = require( './base' ).Builder
  , test = Builder.test
  , Scoper = require( '../src/scoper').Scoper;

assert( typeof Scoper !== 'undefined' );

test( basicScope );
// test( anonymousNamespaces );
// test( nonNamespaces );
// test( nestedNamespaces );
// test( nestedAggregate ); 

function nestedAggregate( emitter, parser ) { 
	var builder = new Scoper( emitter );
	emitter.expect( 'open scope', 'outside' );
	emitter.expect( 'open scope', 'inside1' );
	emitter.expect( 'close scope' );
	emitter.expect( 'open scope', 'inside2' );
	emitter.expect( 'close scope' );
	emitter.expect( 'close scope' );
	parser.process( 'namespace outside{ namespace inside1 {} namespace inside2 {} }', emitter );
}

function nestedNamespaces(emitter, parser) {
	var builder = new Scoper( emitter ); 
	emitter.expect( 'open scope', 'hello' );
	emitter.expect( 'open scope', 'world' );
	emitter.expect( 'open scope', '' );
	emitter.expect( 'close scope' );
	emitter.expect( 'close scope' );
	emitter.expect( 'close scope' );
	parser.process( 'namespace hello{ namespace world{ namespace { } } }', emitter );
}

function basicScope(emitter, parser) {
	
	var parser = new Scoper();

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
