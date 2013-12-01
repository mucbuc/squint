var assert = require( 'assert' ) 
  , Factory = require( '../src/factory' ).Factory
  , test = require( './base' ).Base.test; 

assert( typeof Factory !== 'undefined' ); 

testFactory(); 

function testFactory() {

	test( testNamespaceFormat );
	test( testFunctionFormat ); 
	test( testTypeFormat );

	function testTypeFormat( emitter ) {
		var factory = new Factory()
		  , source = factory.defineType( 'struct hello', 'world' ); 
		assert.deepEqual( source, 'struct hello\n{\n\tworld\n};\n');
		emitter.emit( 'end' );
	}

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
