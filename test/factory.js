var assert = require( 'assert' ) 
  , Factory = require( '../src/factory' ).Factory
  , test = require( './base' ).Base.test; 

assert( typeof Factory !== 'undefined' ); 

testFactory(); 

function testFactory() {

	test( testDefineNamespaceFormat );
	test( testDefineFunctionFormat ); 
	test( testDefineTypeFormat );
	test( testDeclareTypeFormat ); 
	test( testDeclareFunctionFormat );

	function testDeclareFunctionFormat( emitter ) {
		var factory = new Factory()
		  , source = factory.declareFunction( 'void foo()' ); 
		assert.deepEqual( source, 'void foo();\n' );
		emitter.emit( 'end' );
	}

	function testDeclareTypeFormat( emitter ) {
		var factory = new Factory()
		  , source = factory.declareType( 'struct hello' ); 

		assert.deepEqual( source, 'struct hello;\n' );
		emitter.emit( 'end' );
	}

	function testDefineTypeFormat( emitter ) {
		var factory = new Factory()
		  , source = factory.defineType( 'struct hello', 'world' ); 
		assert.deepEqual( source, 'struct hello\n{\n\tworld\n};\n');
		emitter.emit( 'end' );
	}

	function testDefineFunctionFormat(emitter) {

		var factory = new Factory()
		  , source = factory.defineFunction( 'void foo()', 'hello' ); 
		assert.deepEqual( source, 'void foo()\n{\n\thello\n}\n' ); 
		emitter.emit( 'end' );
	}

	function testDefineNamespaceFormat(emitter) {
	
		var factory = new Factory()
		  , source = factory.defineNamespace( 'namespace hello', 'world' ); 
		assert.deepEqual( source, 'namespace hello\n{\n\tworld\n} // namespace hello\n' );
		emitter.emit( 'end' );
	}
}	
