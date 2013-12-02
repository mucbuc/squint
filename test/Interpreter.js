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

	function interpretSingelSingleDeclaration(emitter, parser) {
		var interpreter = new Interpreter( emitter );
		interpreter.declare( 'struct hello;' );	
		assert.deepEqual( interpreter.declarations.types, { 'struct hello': 'undefined' } ); 
	}

	function interpretMergeProduct(emitter, parser) {
		
		var interpreter = new Interpreter( emitter );
		interpreter.declare( 'struct hello;' );
		interpreter.declare( 'struct world;' );
		
		assert.deepEqual( interpreter.declarations.types, { 
				'struct hello': 'undefined', 
		 		'struct world': 'undefined', 
		 	} );
	}

	function interpretDeclarationsAndDefinitions(emitter, parser) {
		var interpreter = new Interpreter( emitter );
	
		interpreter.declare( 'struct hello;' );
		assert.deepEqual( interpreter.declarations.types, {'struct hello': 'undefined'} );
	}
	
}