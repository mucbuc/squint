var assert = require( 'assert' ) 
  , Factory = require( '../src/factory' ).Factory
  , test = require( './base' ).Base.test; 

assert( typeof Factory !== 'undefined' ); 

testFactory(); 

function testFactory() {

	test( testNamespaceFormat );
	test( testFunctionFormat ); 

	function testFunctionFormat(emitter) {

		var factory = new Factory()
		  , source = factory.defineFunction( 'void foo()', 'hello' ); 
		assert.deepEqual( source, 'void foo()\n{\n\thello\n}\n' ); 
		emitter.emit( 'end' );
	}

	function testNamespaceFormat(emitter) {
	
		var factory = new Factory()
		  , source = factory.defineNamespace( 'namespace hello', 'world' ); 
		assert.deepEqual( source, 'namespace hello\n{\n\tworld\n} // namespace hello\n' );
		emitter.emit( 'end' );
	}
}	
