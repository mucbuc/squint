var assert = require( 'assert' ) 
  , Factory = require( '../src/factory' ).Factory
  , test = require( './base' ).Base.test; 

assert( typeof Factory !== 'undefined' ); 

testFactory(); 

function testFactory() {

	test( testDefineNamespaceFormat );
	// test( testDefineFunctionFormat ); 
	// test( testDefineTypeFormat );
	// test( testDeclareTypeFormat ); 
	// test( testDeclareFunctionFormat );

	function testDeclareFunctionFormat( emitter ) {
		var source = Factory.declareFunction( 'void foo()' ); 
		assert.deepEqual( source, '\nvoid foo();' );
		emitter.emit( 'end' );
	}

	function testDeclareTypeFormat( emitter ) {
		var source = Factory.declareType( 'struct hello' ); 

		assert.deepEqual( source, '\nstruct hello;' );
		emitter.emit( 'end' );
	}

	function testDefineTypeFormat( emitter ) {
		var source = Factory.defineType( 'struct hello', 'world' ); 
		assert.deepEqual( source, '\nstruct hello\n{\n\tworld\n};');
		emitter.emit( 'end' );
	}

	function testDefineFunctionFormat(emitter) {

		var source = Factory.defineFunction( 'void foo()', 'hello' ); 
		assert.deepEqual( source, '\nvoid foo()\n{\n\thello\n}' ); 
		emitter.emit( 'end' );
	}

	function testDefineNamespaceFormat(emitter) {
	
		var source = Factory.defineNamespace( 'namespace hello', 'world' ); 
		assert.deepEqual( source, '\nnamespace hello\n{\tworld\n} // namespace hello' );
		emitter.emit( 'end' );

		console.log( 'source', source );
	}
}	
