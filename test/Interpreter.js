var assert = require( 'assert' ) 
  , events = require( 'events' )
  , Interpreter = require( '../src/interpreter' ).Interpreter
  , Base = require( './base' ).Base;

assert( typeof Interpreter !== 'undefined' ); 

testInterpreter(); 

function testInterpreter() {

	test( interpretSingelSingleDeclaration );
	test( interpretMergeProduct );
	test( interpretDeclarationsAndDefinitions );
	test( interpretNestedNamespaces ); 

	function interpretNestedNamespaces(emitter, parser) {
		parser.process( 'namespace out { namespace in { struct hello; } }' );	

//		console.log( parser.namespaces ); 
		assert.deepEqual( parser.namespaces, { 'namespace out': 'namespace in{struct hello;}' } );
	}

	function interpretSingelSingleDeclaration(emitter, parser) {
		parser.process( 'struct hello;' );	
		assert.deepEqual( parser.typeDeclarations, { 'struct hello': 'undefined' } ); 
	}

	function interpretMergeProduct(emitter, parser) {
		
		parser.process( 'struct hello;' );
		parser.process( 'struct world;' );
		assert.deepEqual( parser.typeDeclarations, { 
				'struct hello': 'undefined', 
		 		'struct world': 'undefined', 
		 	} );
	
		parser.process( 'struct hello { world };');
		parser.process( 'struct world { moon };');
		assert.deepEqual( parser.typeDefinitions, { 
				'struct hello': 'world', 
		 		'struct world': 'moon', 
		 	} );
	}

	function interpretDeclarationsAndDefinitions(emitter, parser) {
	
		parser.process( 'struct hello;' );
		assert.deepEqual( parser.typeDeclarations, {'struct hello': 'undefined'} );
	
		parser.process( 'struct hello{};' );
		assert.deepEqual( parser.typeDefinitions, {'struct hello': ''} );
	}

	function test(f) {
		Base.test( f, Interpreter );
	}
}