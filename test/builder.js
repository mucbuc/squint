var assert = require( 'assert' ) 
  , events = require( 'events' )
  , Builder = require( '../src/builder' ).Builder
  , Base = require( './base' ).Base;

assert( typeof Builder !== 'undefined' ); 

testBuilder(); 

function testBuilder() {

  test( builderSingelDeclaration );
  test( namespaceTreeBuilder );
  test( namespaceDeclaration );
  test( builderMergeProduct );
  test( builderDeclarationsAndDefinitions );
  test( builderNestedNamespaces ); 
  test( builderNestedTypes ); 
  test( builderfunctionDeclare ); 

  function builderfunctionDeclare(emitter, parser) 
  {
    var expect = {
        'void foo()': 'undefined'
      };

    parser.process( 'void foo();' );
    assert.deepEqual( parser.functionDeclarations, expect );
  }

  function builderNestedTypes(emitter, parser) 
  {
    var expect = { 
        'struct outside': {
            typeDeclarations: {},
            typeDefinitions: { 
                'struct inside': {
                    typeDeclarations: {},
                    typeDefinitions: {}
                  }
              }
          }
      };

    parser.process( 'struct outside { struct inside {}; };')
    assert.deepEqual( parser.typeDefinitions, expect );
  }

  function builderNestedNamespaces(emitter, parser) {

    var expect = { 
        'namespace outside': {
            namespaces: {
                'namespace inside': {
                    namespaces:{},
                    typeDeclarations: {},
                    typeDefinitions: {}
                  }
              }, 
            typeDeclarations: {},
            typeDefinitions: {}
          }
      };

    parser.process( 'namespace outside { namespace inside {} }' );  
    assert.deepEqual( parser.namespaces, expect );
  }

  function builderDeclarationsAndDefinitions(emitter, parser) {
  
    parser.process( 'struct hello;' );
    assert.deepEqual( parser.typeDeclarations, {'struct hello': 'undefined'} );
  
    parser.process( 'struct hello{};' );
    assert.deepEqual( parser.typeDefinitions, {'struct hello': { typeDeclarations: {}, typeDefinitions: {} } } );
  }

  function builderMergeProduct(emitter, parser) {
    
    parser.process( 'struct hello;' );
    parser.process( 'struct world;' );
    assert.deepEqual( parser.typeDeclarations, { 
        'struct hello': 'undefined', 
        'struct world': 'undefined', 
      } );
  
    parser.process( 'struct hello { world };');
    parser.process( 'struct world { moon };');
    
    assert.deepEqual( parser.typeDefinitions, { 
        'struct hello': { typeDeclarations: {}, typeDefinitions: {} }, 
        'struct world': { typeDeclarations: {}, typeDefinitions: {} }, 
      } );
  }

  function namespaceDeclaration(emitter, parser) {
    var expect = { 
        'namespace outside': {
            namespaces: {
                'namespace inside': {
                    namespaces:{},
                    typeDeclarations: {
                        'struct inside': ''
                      },
                    typeDefinitions: {}
                  }
              }, 
            typeDeclarations: {},
            typeDefinitions: {}
          }
      };

    parser.process( 'namespace outside{ namespace inside { struct hello; } }', emitter );
  } 

  function namespaceTreeBuilder(emitter, parser) {
    var expect = { 
        'namespace outside': {
            namespaces: {
                'namespace inside': {
                    namespaces:{}, 
                    typeDeclarations:{},
                    typeDefinitions: {}
                  }
              },
            typeDeclarations:{},
            typeDefinitions: {}
          } 
      };

    parser.process( 'namespace outside{ namespace inside {} }', emitter );
    assert.deepEqual( expect, parser.namespaces );
  } 
 
  function builderSingelDeclaration(emitter, parser) {
    parser.process( 'struct hello;' );  
    assert.deepEqual( parser.typeDeclarations, { 'struct hello': 'undefined' } ); 
  }

  function test(f) {
    Base.test( f, Builder );
  }
}