var assert = require( 'chai' ).assert
  , events = require( 'events' )
  , Compiler = require( '../../src/analyzers/compiler' ).Compiler
  , Base = require( '../base' ).Base;

assert( typeof Compiler === 'function' );

testCompiler();

function testCompiler() {

  test( builderSingelDeclaration );
  test( namespaceTreeBuilder );
  test( namespaceDeclaration );
  test( builderMergeProduct );
  test( builderDeclarationsAndDefinitions );
	test( builderNestedNamespaces ); 
  test( builderNestedTypes ); 
  test( builderFunctionDeclare ); 
  test( builderFunctonDefine );
  test( builderMemberFunctionDeclare );

  function builderMemberFunctionDeclare(emitter, parser) {
    
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

  function builderFunctonDefine(emitter, parser) {

  	emitter.once( 'compile', function( model ) {
	    var expect = { 'void foo()': 'hello' };
	    assert.deepEqual( model.functions, expect );
  	} );

    parser.process( 'void foo() { hello }', emitter );
  }

  function builderFunctionDeclare(emitter, parser) {
    
  	emitter.once( 'compile', function( model ) {
	    var expect = {
	        'void foo()': 'undefined'
	      };

	    assert.property( model, 'functions' );
	    assert.deepEqual( model.functions, expect );
	  } );

    parser.process( 'void foo();', emitter );

  }

	function builderNestedTypes(emitter, parser) {
	    
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

  function builderNestedNamespaces(emitter, parser) {

  	emitter.once( 'compile', function( model ) {
	    var obj;
	    assert.deepProperty( model, 'namespaces.namespace outside' );
	    obj = model.namespaces[ 'namespace outside' ];
	    assert.deepProperty( obj, 'namespaces.namespace inside' );
  	} );
  	
  	parser.process( 'namespace outside { namespace inside {} }', emitter );  
  }

  function builderDeclarationsAndDefinitions(emitter, parser) {
  
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

  function builderMergeProduct(emitter, parser) {
    
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

  function namespaceTreeBuilder(emitter, parser) {
    
    emitter.once( 'compile', function( model ) {
	    assert.deepProperty( model, 'namespaces.namespace outside' );
	    assert.deepProperty( model.namespaces['namespace outside'], 'namespaces.namespace inside' );
		} );

    parser.process( 'namespace outside{ namespace inside {} }', emitter );
  } 
 
  function builderSingelDeclaration(emitter, parser) {
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