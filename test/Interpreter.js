var assert = require( 'assert' ) 
  , events = require( 'events' )
  , Interpreter = require( '../src/interpreter' ).Interpreter
  , Base = require( './base' ).Base;

assert( typeof Interpreter !== 'undefined' ); 

testInterpreter(); 

function testInterpreter() {

	Base.test( interpretDeclarationsAndDefinitions );
	Base.test( interpretMergeProduct );

	function interpretMergeProduct(emitter, parser) {
		var interpreter = new Interpreter();
		interpreter.process( 'struct hello;', emitter );
		interpreter.process( 'struct world;', emitter );

		assert.deepEqual( interpreter.declarations, { 
				namespaces:{}, 
				types:{ 'struct hello': 'undefined', 'struct world': 'undefined' }, 
				functions:{} 
			} );
	}

	function interpretDeclarationsAndDefinitions(emitter, parser) {
		var interpreter = new Interpreter();
		interpreter.process( 'struct hello;', emitter );
	
		assert.deepEqual( interpreter.declarations, { 
				namespaces:{}, 
				types:{ 'struct hello': 'undefined' }, 
				functions:{} 
			} );
	}
	
}