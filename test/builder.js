var assert = require( 'chai' ).assert 
  , events = require( 'events' )
  , Builder = require( '../src/builder' ).Builder
  , Factory = require( '../src/factories/factory' ).Factory
  , Implement = require( '../src/factories/implement' ).Implement
  , Header = require( '../src/factories/header' ).Header
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
  test( builderMemberFunctionDeclare );
  test( builderBuildNestedNamespaces );
  test( builderBuildNestedTypes );
  
  //test( builderBuildMemberFunctions );

  test( builderBuildNamespaceFunction ); 

  function builderBuildNamespaceFunction(emitter, parser) {
    var result;
    parser.process( 'namespace bla{ void foo(); }' );
    result = parser.build( new Header() );
    assert.match( result, /\s*namespace\s+bla\s*{\s*void\s+foo\s*\(\s*\)\s*;\s*}.*/ );
  }

  function builderBuildMemberFunctions(emitter, parser) {
    var result;
    parser.process( 'struct bla { void foo(); };' );
    result = parser.build( new Header() );
    assert.match( result, /\s*struct\s+bla\s*{\s*void\s+foo\s*\(\s*\)\s*;\s*};/ );

    result = parser.build( new Implement() );
    assert.match( result, /\s*void\s+bla::foo\s*\(\s*\)\s*{\s*}/ );

    console.log( result );
  } 

  function builderBuildNestedTypes(emitter, parser) {
    var result;
    parser.process( 'struct outside { struct inside{}; };' );
    result = parser.build( new Header() );
    assert.match( result, /\s*struct\s+outside\s*{\s*struct\s+inside\s*{\s*};\s*};/ );
  }

  function builderBuildNestedNamespaces(emitter, parser){
    var result;
    parser.process( 'namespace outside{ namespace inside {} }', emitter );
    result = parser.build( new Factory() );
    assert.match( result, /\s*namespace\s+outside\s*{\s*namespace\s+inside\s*{\s*}.*\s*}.*/ );
  }

  function builderMemberFunctionDeclare(emitter, parser) {
    
    var obj;
    parser.process( 'struct text{void member();};', emitter );
    
    assert( parser.hasOwnProperty( 'types' ) );
    obj = parser.types;

    assert( obj.hasOwnProperty( 'struct text' ) ); 
    obj = obj[ 'struct text' ];

    assert( obj.hasOwnProperty( 'functions' ) ); 
    obj = obj.functions;

    assert( obj.hasOwnProperty( 'void member()' ) );
    obj = obj['void member()'];

    assert.deepEqual( obj, 'undefined' );
  }

  function builderFunctonDefine(emitter, parser) {
    var expect = { 'void foo()': 'hello' };
    parser.process( 'void foo() { hello }' );
    
    assert.deepEqual( parser.functions, expect );
  }

  function builderFunctionDeclare(emitter, parser) {
    var expect = {
        'void foo()': 'undefined'
      };

    parser.process( 'void foo();' );
    assert.property( parser, 'functions' );
    assert.deepEqual( parser.functions, expect );
  }

  function builderNestedTypes(emitter, parser) {
    var obj;

    parser.process( 'struct outside { struct inside {}; };')
    assert.deepProperty( parser, 'types.struct outside' );

    obj = parser.types[ 'struct outside' ];
    assert.deepProperty( obj, 'types.struct inside' );

    obj = obj.types[ 'struct inside' ];
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
    assert.deepProperty( parser, 'types.struct hello' );
    assert.deepEqual( parser.types[ 'struct hello' ], 'undefined' );
  
    parser.process( 'struct hello{};' );
    assert.deepProperty( parser, 'types.struct hello' );
    assert.isDefined( parser.types['struct hello'] );
  }

  function builderMergeProduct(emitter, parser) {
    
    parser.process( 'struct hello;' );
    assert.deepProperty( parser, 'types.struct hello' );
    assert.deepEqual( parser.types['struct hello'], 'undefined' );

    parser.process( 'struct world;' );
    assert.deepProperty( parser, 'types.struct world' );
    assert.deepEqual( parser.types['struct world'], 'undefined' );

    parser.process( 'struct hello { world };');
    parser.process( 'struct world { moon };');
      
    assert.isDefined( parser.types['struct hello'] );
    assert.isDefined( parser.types['struct world'] );
  }

  function namespaceDeclaration(emitter, parser) {
    var obj; 
    
    parser.process( 'namespace outside{ namespace inside { struct hello; } }', emitter );
    
    assert.deepProperty( parser, 'namespaces.namespace outside' ); 
    obj = parser.namespaces[ 'namespace outside' ];

    assert.deepProperty( obj, 'namespaces.namespace inside' );
    obj = obj.namespaces[ 'namespace inside' ];

    assert.deepProperty( obj, 'types.struct hello' );
    obj = obj.types['struct hello'];
    
    assert.deepEqual( obj, 'undefined' );
  } 

  function namespaceTreeBuilder(emitter, parser) {
    parser.process( 'namespace outside{ namespace inside {} }', emitter );
    assert.deepProperty( parser, 'namespaces.namespace outside' );
    assert.deepProperty( parser.namespaces['namespace outside'], 'namespaces.namespace inside' );
  } 
 
  function builderSingelDeclaration(emitter, parser) {
    parser.process( 'struct hello;' );  
    assert.deepProperty( parser, 'types.struct hello' ); 
    assert.deepEqual( parser.types[ 'struct hello' ], 'undefined' ); 
  }

  function test(f) {
    Base.test( f, Builder );
  }
}