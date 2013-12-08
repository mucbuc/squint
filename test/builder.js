var assert = require( 'chai' ).assert 
  , events = require( 'events' )
  , Builder = require( '../src/builder' ).Builder
  , Base = require( './base' ).Base;

assert( typeof Builder !== 'undefined' ); 

process.setMaxListeners( 0 );

testBuilder(); 

function testBuilder() {

  test( builderSingelDeclaration );
  test( namespaceTreeBuilder );
  test( namespaceDeclaration );
  test( builderMergeProduct );
  test( builderDeclarationsAndDefinitions );
  test( builderNestedNamespaces ); 
  test( builderNestedTypes ); 
  test( builderFunctionDeclare ); 
  test( builderFunctonDefine );
  test( builderFunctionDeclareAndDefine );
  test( builderMemberFunctionDeclare );

  function builderMemberFunctionDeclare(emitter, parser) {
    
    var obj;
    parser.process( 'struct text{void member();};', emitter );
    
    assert( parser.hasOwnProperty( 'typeDefinitions' ) );
    obj = parser.typeDefinitions;

    assert( obj.hasOwnProperty( 'struct text' ) ); 
    obj = obj[ 'struct text' ];

    assert( obj.hasOwnProperty( 'functionDeclarations' ) ); 
    obj = obj.functionDeclarations;

    assert( obj.hasOwnProperty( 'void member()' ) );
    obj = obj['void member()'];

    assert.deepEqual( obj, 'undefined' );
  }

  function builderFunctionDeclareAndDefine(emitter, parser) {
    parser.process( 'void foo(); void foo() { hello }' );
    assert.deepEqual( parser.functionDeclarations, { 'void foo()':'undefined' } );
    assert.deepEqual( parser.functionDefinitions, { 'void foo()':'hello' } );
  }

  function builderFunctonDefine(emitter, parser) {
    var expect = { 'void foo()': 'hello' };
    parser.process( 'void foo() { hello }' );
    
    assert.deepEqual( parser.functionDefinitions, expect );
  }

  function builderFunctionDeclare(emitter, parser) {
    var expect = {
        'void foo()': 'undefined'
      };

    parser.process( 'void foo();' );
    assert.property( parser, 'functionDeclarations' );
    assert.deepEqual( parser.functionDeclarations, expect );
  }

  function builderNestedTypes(emitter, parser) {
    var obj;

    parser.process( 'struct outside { struct inside {}; };')
    assert.deepProperty( parser, 'typeDefinitions.struct outside' );

    obj = parser.typeDefinitions[ 'struct outside' ];
    assert.deepProperty( obj, 'typeDefinitions.struct inside' );

    obj = obj.typeDefinitions[ 'struct inside' ];
    assert.isDefined( obj );
  }

  function builderNestedNamespaces(emitter, parser) {

    var obj;

    parser.process( 'namespace outside { namespace inside {} }' );  
    assert.deepProperty( parser, 'namespaces.namespace outside' );
  
    obj = parser.namespaces[ 'namespace outside' ];
    assert.deepProperty( obj, 'namespaces.namespace inside' );
  }

  function builderDeclarationsAndDefinitions(emitter, parser) {
  
    parser.process( 'struct hello;' );
    assert.deepProperty( parser, 'typeDeclarations.struct hello' );
    assert.deepEqual( parser.typeDeclarations[ 'struct hello' ], 'undefined' );
  
    parser.process( 'struct hello{};' );
    assert.deepProperty( parser, 'typeDefinitions.struct hello' );
    assert.isDefined( parser.typeDefinitions['struct hello'] );
  }

  function builderMergeProduct(emitter, parser) {
    
    parser.process( 'struct hello;' );
    assert.deepProperty( parser, 'typeDeclarations.struct hello' );
    assert.deepEqual( parser.typeDeclarations['struct hello'], 'undefined' );

    parser.process( 'struct world;' );
    assert.deepProperty( parser, 'typeDeclarations.struct world' );
    assert.deepEqual( parser.typeDeclarations['struct world'], 'undefined' );

    parser.process( 'struct hello { world };');
    parser.process( 'struct world { moon };');
      
    assert.isDefined( parser.typeDeclarations['struct hello'] );
    assert.isDefined( parser.typeDeclarations['struct world'] );
  }

  function namespaceDeclaration(emitter, parser) {
    var obj; 
    
    parser.process( 'namespace outside{ namespace inside { struct hello; } }', emitter );
    
    assert.deepProperty( parser, 'namespaces.namespace outside' ); 
    obj = parser.namespaces[ 'namespace outside' ];

    assert.deepProperty( obj, 'namespaces.namespace inside' );
    obj = obj.namespaces[ 'namespace inside' ];

    assert.deepProperty( obj, 'typeDeclarations.struct hello' );
    obj = obj.typeDeclarations['struct hello'];
    
    assert.deepEqual( obj, 'undefined' );
  } 

  function namespaceTreeBuilder(emitter, parser) {
    parser.process( 'namespace outside{ namespace inside {} }', emitter );
    assert.deepProperty( parser, 'namespaces.namespace outside' );
    assert.deepProperty( parser.namespaces['namespace outside'], 'namespaces.namespace inside' );
  } 
 
  function builderSingelDeclaration(emitter, parser) {
    parser.process( 'struct hello;' );  
    assert.deepProperty( parser, 'typeDeclarations.struct hello' ); 
    assert.deepEqual( parser.typeDeclarations[ 'struct hello' ], 'undefined' ); 
  }

  function test(f) {
    Base.test( f, Builder );
  }
}