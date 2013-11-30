
var assert = require( 'assert' )
  , Builder = require( './base' ).Builder
  , Type = require( '../src/type' ).Type;

assert( typeof Type !== 'undefined' );

testNamespace();

function testNamespace() {

	test( defineNamespace );

	function defineNamespace(emitter, parser) {
		
		emitter.expectNot( 'define type' );
		emitter.expectNot( 'define function' );

		emitter.expect( 'define namespace', { name: 'namespace hello', code: 'this is it' } );
		parser.process( 'namespace hello { this is it }', emitter );
	
		emitter.expect( 'define namespace', { name: 'namespace world', code: 'wtf?' } );
		parser.process( 'namespace world { wtf? }', emitter );
	}
}

function test(f) {
	Builder.test( f, Type );
}