var assert = require( 'assert' ) 
  , events = require( 'events' )
  , Interpreter = require( '../src/interpreter' ).Interpreter
  , Base = require( './base' ).Base;

assert( typeof Interpreter !== 'undefined' ); 

testInterpreter(); 

function testInterpreter() {

	test( interpretSingelDeclaration );
	test( namespaceTreeBuilder );
	//test( namespaceDeclaration );
	//test( typeTreeBuilder ); 

	function namespaceDeclaration(emitter, parser) {
		var expect = { 
				'namespace outside': {
						namespaces: {
								'namespace inside': {
										namespaces:{},
										typeDeclarations: {
												'struct inside': ''
											}
									}
							}, 
						typeDeclarations: {}
					}
			};

		parser.process( 'namespace outside{ namespace inside { struct hello; } }', emitter );
	}	

	function interpretSingelDeclaration(emitter, parser) {
		parser.process( 'struct hello;' );	
		assert.deepEqual( parser.typeDeclarations, { 'struct hello': 'undefined' } ); 
	}

	function namespaceTreeBuilder(emitter, parser) {
		var expect = { 
				'namespace outside': {
						namespaces: {
								'namespace inside': {
										namespaces:{}, 
										typeDeclarations:{}
									}
							},
						typeDeclarations:{}
					} 
			};

		parser.process( 'namespace outside{ namespace inside {} }', emitter );
		assert.deepEqual( expect, parser.namespaces );
	}	


	function typeTreeBuilder(emitter, parser) {
		var expect = { 'struct outside': 
				{
					typeDeclarations: {
						'struct inside': {
							typeDeclarations:{}
						}
					}
				} 
			};

		parser.process( 'struct outside{ struct inside {} }', emitter );
		//assert.deepEqual( expect, parser.typeDeclarations );
	}

	// 
	// test( interpretMergeProduct );
	// test( interpretDeclarationsAndDefinitions );
	//test( interpretNestedNamespaces ); 

	function interpretNestedNamespaces(emitter, parser) {

		var expect = { 
			'namespace out': {
				'namespaces': { 
					'namespace in': {
						'types': {
							'struct hello': 'undefined'
						}
					}
				},
				'types' : undefined, 
				'functions' : undefined
			}
		};

		parser.process( 'namespace out { namespace in { struct hello; } }' );	

		assert.equal( parser.namespaces, expect );
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