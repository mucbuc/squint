
var assert = require( 'assert' )
  , Builder = require( './base' ).Builder
  , Type = require( '../src/type' ).Type;

assert( typeof Type !== 'undefined' );

testNamespace();
testType();
testFunction();

function testFunction() {

	test( basicFunction );

	function basicFunction( emitter, parser ) {
		emitter.expectNot( 'open namespace' );
		emitter.expectNot( 'open type' ); 
		emitter.expectNot( 'close namespace' );
		emitter.expectNot( 'close type' );
		emitter.expect( 'open function', 'foo()' );
		emitter.expect( 'close function', 'hello' );

		parser.process( 'foo(){ hello }', emitter );
	}
}

function testType() {
	test( basicType );

	function basicType(emitter, parser) {

		emitter.expectNot( 'open namespace' );
		emitter.expectNot( 'close namespace' );
		emitter.expect( 'open type', 'struct namespace' );

		parser.process( 'struct namespace { }', emitter );
	}
}

function testNamespace() {

	test( basicNamespace );
	test( nonNamespace );
	test( aggregateNamespace );
	test( defineNamespace );

	function defineNamespace(emitter, parser) {
		emitter.expect( 'define namespace', { name: 'namespace hello', code: 'this is it' } );

		parser.process( 'namespace hello { this is it }', emitter );
	}

	function aggregateNamespace(emitter, parser) {
		emitter.expect( 'open namespace', 'namespace hello' );
		emitter.expect( 'close namespace', 'hell' );
		emitter.expect( 'open namespace', 'namespace world' );
		emitter.expect( 'close namespace', 'word' );

		parser.process( 'namespace hello { hell } namespace world { word }', emitter );
	}

	function nonNamespace(emitter, parser) {
		
		emitter.expectNot( 'open namespace' );
		emitter.expectNot( 'close namespace' );

		parser.process( 'struct namespace { }', emitter );
	}

	function basicNamespace(emitter, parser) {
		emitter.expect( 'open namespace', 'namespace bka' ); 
		emitter.expect( 'close namespace', 'hello' ); 
		parser.process( 'namespace bka{ hello }', emitter );

		emitter.expect( 'open namespace', 'namespace bka' ); 
		emitter.expect( 'close namespace', 'namespace hello{}' ); 
		parser.process( 'namespace bka{ namespace hello {} }', emitter );
	}	
}

function test(f) {
	Builder.test( f, Type );
}