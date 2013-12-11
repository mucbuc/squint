var assert = require( 'chai' ).assert 
  , Factory = require( '../src/factories/factory' ).Factory
  , Implement = require( '../src/factories/implement' ).Implement
  , Header = require( '../src/factories/header' ).Header
  , test = require( './base' ).Base.test; 

assert( typeof Factory !== 'undefined' ); 

testFactory(); 

function testFactory() {

	test( testDefineNamespaceFormat );
	test( testDefineFunctionFormat ); 
	test( testDeclareTypeMember );
	test( testDeclareTypeFormat ); 
	test( testDeclareFunctionFormat );

	function testDeclareFunctionFormat( emitter ) {
		var factory = new Header()
		  , source = factory.function( 'void foo()' ); 
		assert.match( source, /\s*void\s+foo\(\);/ );
		emitter.emit( 'end' );
	}

	function testDeclareTypeFormat( emitter ) {
		var factory = new Header()
		  , source = factory.type( 'struct hello;' ); 

		assert.match( source, /\s*struct\s+hello;/ );
		emitter.emit( 'end' );
	}

	function testDeclareTypeMember( emitter ) {
		var factory = new Header()
		  , source = factory.type( 'struct hello', 'world' ); 
		assert.match( source, /\s*struct\s+hello\s*{\s*\tworld\s*};/ );
		emitter.emit( 'end' );
	}

	function testDefineFunctionFormat(emitter) {

		var factory = new Implement()
		  , source = factory.function( 'void foo()', 'hello;' ); 
		assert.match( source, /\s*void\s+foo\s*\(\s*\)\s*{\s*\thello;\s*}/ ); 
		emitter.emit( 'end' );
	}

	function testDefineNamespaceFormat(emitter) {
	
		var factory = new Factory() 
		  , source = factory.namespace( 'namespace hello', 'world' ); 
		assert.match( source, /\s*namespace\s+hello\s*{\s*\tworld\s*}.*/ ); 
		emitter.emit( 'end' );
	}
}	
