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

  function builderSingelDeclaration(emitter, parser) {
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

  function builderNestedNamespaces(emitter, parser) {

    var expect = { 
        'namespace outside': {
            namespaces: {
                'namespace inside': {
                    namespaces:{},
                    typeDeclarations: {}
                  }
              }, 
            typeDeclarations: {}
          }
      };

    parser.process( 'namespace outside { namespace inside {} }' );  

    assert.deepEqual( parser.namespaces, expect );
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
        'struct hello': 'world', 
        'struct world': 'moon', 
      } );
  }

  function builderDeclarationsAndDefinitions(emitter, parser) {
  
    parser.process( 'struct hello;' );
    assert.deepEqual( parser.typeDeclarations, {'struct hello': 'undefined'} );
  
    parser.process( 'struct hello{};' );
    assert.deepEqual( parser.typeDefinitions, {'struct hello': ''} );
  }

  function test(f) {
    Base.test( f, Builder );
  }
}