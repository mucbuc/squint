var assert = require( 'assert' )
  , events = require( 'events' )
  , Type = require( '../src/type' ).Type
  , Builder = require( '../src/builder' ).Builder
  , Base = require( './base' ).Base
  , Test = require( 'mucbuc-jsthree' ).Test;

assert( typeof Builder !== 'undefined' ); 

testBuilder(); 

function testBuilder() {

	test( testNamespaces ); 
	test( testTypes );
	test( testFunctions ); 

	function testFunctions( emitter, parser ) {

		var builder = new Builder( emitter, {} );
		parser.process( 'void foo() { hello }', emitter );
		assert.deepEqual( builder.product.functions[ 'void foo()' ], 'hello' ); 
	}

	function testTypes(emitter, parser) {
		
		var builder = new Builder( emitter, {} );
		parser.process( 'struct bla{ blablabla }', emitter );
		assert.deepEqual( builder.product.types[ 'struct bla' ], 'blablabla' ); 
	}

	function testNamespaces(emitter, parser) { 

		var builder = new Builder(emitter, {} ); 
		parser.process( 'namespace bla{ } namespace bladf { saf3r23sfsd} namespace { dsfs }', emitter );
		assert.deepEqual( builder.product.namespaces[ 'namespace bla' ], '' ); 
		assert.deepEqual( builder.product.namespaces[ 'namespace bladf' ], 'saf3r23sfsd' ); 
		assert.deepEqual( builder.product.namespaces[ 'namespace' ], 'dsfs' ); 
	}
	
	function test(f) { 
		Base.test( f, Type );
	}
}
