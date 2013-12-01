
var assert = require( 'assert' )
  , Base = require( './base' ).Base
  , Type = require( '../src/type' ).Type;

assert( typeof Type !== 'undefined' );

testNamespace();
testType(); 
testFunction();

function testFunction() {
	test( defineFunction );

	function defineFunction(emitter, parser) {
		emitter.expectNot( 'define namespace' );
		emitter.expectNot( 'define type' );

		emitter.expect( 'define function', { name: 'void foo()', code: 'do something' } );
		parser.process( 'void foo() { do something }', emitter );
		
		emitter.expect( 'define function', { name: 'void fool()', code: 'do nothing' } );
		parser.process( 'void fool() { do nothing }', emitter );
	}
}

function testType() {

	test( defineType ); 
	
	function defineType(emitter, parser) {
		emitter.expectNot( 'define namespace' );
		emitter.expectNot( 'define function' );

		emitter.expect( 'define type', { name: 'struct hello', code: 'unsigned world;' } );
		parser.process( 'struct hello { unsigned world; }', emitter );
	
		emitter.expect( 'define type', { name: 'struct cya', code: 'yes' } );
		parser.process( 'struct cya { yes}', emitter );
	}
}

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
	Base.test( f, Type );
}