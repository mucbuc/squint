var assert = require( 'assert' ) 
  , events = require( 'events' )
  , Interpreter = require( '../src/interpreter' ).Interpreter
  , Base = require( './base' ).Base;

assert( typeof Interpreter !== 'undefined' ); 

testInterpreter(); 

function testInterpreter() {

	Base.test( interpretSingelSingleDeclaration );
	Base.test( interpretMergeProduct );
	Base.test( interpretDeclarationsAndDefinitions );
	Base.test( interpretNestedNamespaces ); 

	function interpretNestedNamespaces(emitter) {
		var interpreter = new Interpreter( emitter );
		interpreter.process( 'namespace out { namespace in { struct hello; } }' );	
		assert.deepEqual( interpreter.definitions.namespaces, { 'namespace out': 'namespace in{struct hello;}' } );
	}

	function interpretSingelSingleDeclaration(emitter) {
		var interpreter = new Interpreter( emitter );
		interpreter.declare( 'struct hello;' );	
		assert.deepEqual( interpreter.declarations.types, { 'struct hello': 'undefined' } ); 
	}

	function interpretMergeProduct(emitter) {
		
		var interpreter = new Interpreter( emitter );
		interpreter.declare( 'struct hello;' );
		interpreter.declare( 'struct world;' );
		assert.deepEqual( interpreter.declarations.types, { 
				'struct hello': 'undefined', 
		 		'struct world': 'undefined', 
		 	} );
	
		interpreter.define( 'struct hello { world };');
		interpreter.define( 'struct world { moon };');
		assert.deepEqual( interpreter.definitions.types, { 
				'struct hello': 'world', 
		 		'struct world': 'moon', 
		 	} );
	}

	function interpretDeclarationsAndDefinitions(emitter) {
		var interpreter = new Interpreter( emitter );
	
		interpreter.declare( 'struct hello;' );
		assert.deepEqual( interpreter.declarations.types, {'struct hello': 'undefined'} );
	
		interpreter.define( 'struct hello{};' );
		assert.deepEqual( interpreter.definitions.types, {'struct hello': ''} );
	}
	
}