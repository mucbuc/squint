
var assert = require( 'assert' )
  , Builder = require( './base' ).Builder
  , Type = require( '../src/type' ).Type;

assert( typeof Type !== 'undefined' );

testNamespace();
testType();

function testType() {
	test( basicType );

	function basicType(emitter, parser) {

		emitter.expectNot( 'open namespace' );
		emitter.expectNot( 'close namespace' );
		emitter.expect( 'open type', 'namespace' );

		parser.process( 'struct namespace { }', emitter );
	}
}

function testNamespace() {

	test( basicNamespace );
	test( nonNamespace );

	function nonNamespace(emitter, parser) {
		
		emitter.expectNot( 'open namespace' );
		emitter.expectNot( 'close namespace' );

		parser.process( 'struct namespace { }', emitter );
	}

	function basicNamespace(emitter, parser) {
		emitter.expect( 'open namespace', 'bka' ); 
		emitter.expect( 'close namespace', 'hello' ); 
		parser.process( 'namespace bka{ hello }', emitter );

		emitter.expect( 'open namespace', 'bka' ); 
		emitter.expect( 'close namespace', 'namespace hello{}' ); 
		parser.process( 'namespace bka{ namespace hello {} }', emitter );
	}	
}

function test(f) {
	Builder.test( f, Type );
}