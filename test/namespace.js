
var assert = require( 'assert' )
  , Builder = require( './base' ).Builder
  , Namespace = require( '../src/namespace' ).Namespace;

assert( typeof Namespace !== 'undefined' );

testNamespace(); 

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

	function test(f) {
		Builder.test( f, Namespace );
	}
}