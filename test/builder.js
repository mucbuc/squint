var assert = require( 'assert' )
  , events = require( 'events' )
  , Definer = require( '../src/definer' ).Definer
  , Declarer = require( '../src/declarer' ).Declarer
  , Builder = require( '../src/builder' ).Builder
  , Base = require( './base' ).Base
  , Test = require( 'mucbuc-jsthree' ).Test;

assert( typeof Builder !== 'undefined' ); 

testBuilderDefines(); 
testBuilderDeclarations();

function testBuilderDeclarations() {

	test( testTypeDeclaration );
	test( testFunctionDeclaration );

	function testFunctionDeclaration( emitter, parser ) {
	
		var builder = new Builder( emitter, {} );
		parser.process( 'void empty();', emitter );
	   	assert.deepEqual( builder.product.functions[ 'void empty()' ], 'undefined' ); 
   	}

	function testTypeDeclaration( emitter, parser ) {
	
		var builder = new Builder( emitter, {} );
		parser.process( 'struct empty;', emitter );
	   	assert.deepEqual( builder.product.types[ 'struct empty' ], 'undefined' ); 
   	}

	function test(f) { 
		Base.test( f, Declarer );
	}
}

function testBuilderDefines() {

	test( testNamespaces ); 
	test( testTypes );
	test( testFunctions ); 
	test( testNestedNamespace );

    function testNestedNamespace( emitter, parser ) {

    	var builder = new Builder( emitter, {} );
    	parser.process( 'namespace bla { namespace blah { struct empty; } }', emitter );
    	assert.deepEqual( builder.product.namespaces[ 'namespace bla' ], 'namespace blah{struct empty;}' ); 
	}

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
		Base.test( f, Definer );
	}
}
