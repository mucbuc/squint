var assert = require( 'chai' ).assert
  , events = require( 'events' )
  , Compiler = require( '../../src/analyzers/compiler' ).Compiler
  , Base = require( '../base' ).Base;

assert( typeof Compiler === 'function' );

testCompiler();

function testCompiler() {

  test( compilerSingelDeclaration );
  test( namespaceTreeCompiler );
  test( namespaceDeclaration );
  test( compilerMergeProduct );
  test( compilerDeclarationsAndDefinitions );
	test( compilerNestedNamespaces ); 
  test( compilerNestedTypes ); 
  test( compilerFunctionDeclare ); 
  test( compilerFunctonDefine );
  test( compilerMemberFunctionDeclare );

  function compilerMemberFunctionDeclare(emitter, parser) {
    
	emitter.on( 'compile', function( model ) {

	    var obj;
	    assert( model.hasOwnProperty( 'types' ) );
	    obj = model.types;

	    assert( obj.hasOwnProperty( 'struct text' ) ); 
	    obj = obj[ 'struct text' ];

	    assert( obj.hasOwnProperty( 'functions' ) ); 
	    obj = obj.functions;

	    assert( obj.hasOwnProperty( 'void member()' ) );
	    obj = obj['void member()'];

	    assert.deepEqual( obj, 'undefined' );
  
	} );
    
    parser.process( 'struct text{void member();};', emitter );
  }

  function compilerFunctonDefine(emitter, parser) {

  	emitter.once( 'compile', function( model ) {
	    var expect = { 'void foo()': 'hello' };
	    assert.deepEqual( model.functions, expect );
  	} );

    parser.process( 'void foo() { hello }', emitter );
  }

  function compilerFunctionDeclare(emitter, parser) {
    
  	emitter.once( 'compile', function( model ) {
	    var expect = {
	        'void foo()': 'undefined'
	      };

	    assert.property( model, 'functions' );
	    assert.deepEqual( model.functions, expect );
	  } );

    parser.process( 'void foo();', emitter );

  }

	function compilerNestedTypes(emitter, parser) {
	    
		emitter.once( 'compile', function( model ) {

	    var obj;
	    assert.deepProperty( model, 'types.struct outside' );

	    obj = model.types[ 'struct outside' ];
	    assert.deepProperty( obj, 'types.struct inside' );

	    obj = obj.types[ 'struct inside' ];
	    assert.isDefined( obj );
	  } );

    parser.process( 'struct outside { struct inside {}; };', emitter );
  }

  function compilerNestedNamespaces(emitter, parser) {

  	emitter.once( 'compile', function( model ) {
	    var obj;
	    assert.deepProperty( model, 'namespaces.namespace outside' );
	    obj = model.namespaces[ 'namespace outside' ];
	    assert.deepProperty( obj, 'namespaces.namespace inside' );
  	} );
  	
  	parser.process( 'namespace outside { namespace inside {} }', emitter );  
  }

  function compilerDeclarationsAndDefinitions(emitter, parser) {
  
    emitter.once( 'compile', function( model ) {
	    assert.deepProperty( model, 'types.struct hello' );
	    assert.deepEqual( model.types[ 'struct hello' ], 'undefined' );
		} );
    parser.process( 'struct hello;', emitter );

		emitter.once( 'compile', function(model) {
			assert.deepProperty( model, 'types.struct hello' );
	    assert.isDefined( model.types['struct hello'] );
		} );	
		parser.process( 'struct hello{};', emitter );
  }

  function compilerMergeProduct(emitter, parser) {
    
    emitter.once( 'compile', function( model ) {
	    assert.deepProperty( model, 'types.struct hello' );
	    assert.deepEqual( model.types['struct hello'], 'undefined' );
	  } ); 
	  parser.process( 'struct hello;', emitter );

	  emitter.once( 'compile', function( model ) {
	 	  assert.deepProperty( model, 'types.struct world' );
	    assert.deepEqual( model.types['struct world'], 'undefined' );
    } );
		parser.process( 'struct world;', emitter );

		emitter.once( 'compile', function( model ) {
			assert.isDefined( model.types['struct hello'] );

			emitter.once( 'compile', function( model ) {
				assert.isDefined( model.types['struct world'] );
			} );

			parser.process( 'struct world { moon };', emitter );
		} );
    parser.process( 'struct hello { world };', emitter );
  }

  function namespaceDeclaration(emitter, parser) {
    
  	emitter.once( 'compile', function( model ) {
	    var obj; 
	    assert.deepProperty( model, 'namespaces.namespace outside' ); 
	    obj = model.namespaces[ 'namespace outside' ];

	    assert.deepProperty( obj, 'namespaces.namespace inside' );
	    obj = obj.namespaces[ 'namespace inside' ];

	    assert.deepProperty( obj, 'types.struct hello' );
	    obj = obj.types['struct hello'];
	    
	    assert.deepEqual( obj, 'undefined' );
    } );

    parser.process( 'namespace outside{ namespace inside { struct hello; } }', emitter );
  } 

  function namespaceTreeCompiler(emitter, parser) {
    
    emitter.once( 'compile', function( model ) {
	    assert.deepProperty( model, 'namespaces.namespace outside' );
	    assert.deepProperty( model.namespaces['namespace outside'], 'namespaces.namespace inside' );
		} );

    parser.process( 'namespace outside{ namespace inside {} }', emitter );
  } 
 
  function compilerSingelDeclaration(emitter, parser) {
  	emitter.once( 'compile', function( model ) {
  		assert.deepProperty( model, 'types.struct hello' ); 
  		assert.deepEqual( model.types[ 'struct hello' ], 'undefined' ); 
  	} );
    parser.process( 'struct hello;', emitter );  
  }

  function test(f) {
    Base.test( f, Compiler );
  }
}