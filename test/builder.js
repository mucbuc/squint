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

	function testNamespaces(emitter, parser) { 

		var factory = {}
		  , builder = new Builder(emitter, factory); 

		parser.process( 'namespace bla{ } namespace bladf { saf3r23sfsd} namespace _ { dsfs }', emitter );

		assert.deepEqual( builder.product.namespaces[ 'namespace bla' ], '' ); 
		assert.deepEqual( builder.product.namespaces[ 'namespace bladf' ], 'saf3r23sfsd' ); 
		assert.deepEqual( builder.product.namespaces[ 'namespace _' ], 'dsfs' ); 
	}
}

function test(f) { 
	Base.test( f, Type );
}