var assert = require( 'assert' ) 
  , Factory = require( '../src/factory' ).Factory
  , Base = require( './base' ).Base; 

assert( typeof Factory !== 'undefined' ); 

testFactory(); 

function testFactory() {

	Base.test( testNamespaceFormat );

	function testNamespaceFormat(emitter) {
		var factory = new Factory()
		  , source = factory.defineNamespace( 'namespace hello', 'world' ); 

		assert.deepEqual( source, 'namespace hello\n{\n\tworld\n} // namespace hello\n' );
	
		emitter.emit( 'end' );
	}
}	
