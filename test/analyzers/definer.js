
var assert = require( 'assert' )
  , Base = require( '../base' ).Base
  , Definer = require( '../../src/analyzers/definer' ).Definer;

assert( typeof Definer !== 'undefined' );

testNamespace();
testType(); 
testFunction();

function testFunction() {

	test( defineFunction );

	function defineFunction(emitter, parser) {
		emitter.expectNot( 'define namespace' );
		emitter.expectNot( 'define type' );

		emitter.expect( 'define function', { name: 'void foo()', code: 'do something' } );
		parser.process( 'void foo() { do something }' );
		
		emitter.expect( 'define function', { name: 'void fool()', code: 'do nothing' } );
		parser.process( 'void fool() { do nothing }' );
 
		emitter.expect( 'define function', { name: 'hello::hello()', code: 'bla bla' } );
		parser.process( 'hello::hello() : base() {bla bla}' );
	}
}

function testType() {

	test( defineType ); 
	
	function defineType(emitter, parser) {
		emitter.expectNot( 'define namespace' );
		emitter.expectNot( 'define function' );

		emitter.expect( 'define type', { name: 'struct hello', code: 'unsigned world;' } );
		parser.process( 'struct hello { unsigned world; }' );
	
		emitter.expect( 'define type', { name: 'struct cya', code: 'yes' } );
		parser.process( 'struct cya { yes}' );
	}
}

function testNamespace() {

	test( defineNamespace );

	function defineNamespace(emitter, parser) {
		
		emitter.expectNot( 'define type' );
		emitter.expectNot( 'define function' );

		emitter.expect( 'define namespace', { name: 'namespace hello', code: 'this is it' } );
		parser.process( 'namespace hello { this is it }' );
	
		emitter.expect( 'define namespace', { name: 'namespace world', code: 'wtf?' } );
		parser.process( 'namespace world { wtf? }' );
	}
}

function test(f) {
	Base.test( f, Definer );
}