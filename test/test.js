#!/usr/bin/env node

var assert = require( 'assert' )
//  , squint = require( '../src/squint' )
  , Builder = require( './base' ).Builder
  , test = Builder.test;

  //, Namespacer = require( '../src/builder/namespacer' ).Namespacer;
  
//assert( typeof squint != 'undefined' );

runTest();

function runTest() {

  process.setMaxListeners( 0 );

  require( './parser' ); 
  require( './scoper' );
  require( './type' ); 

  //testExternals();
  //test( forwardDeclarations );

  function forwardDeclarations(emitter) {
    squint.forward( 'struct hello {};', function( result ) {
      assert( result.trim() == 'struct hello' );
      emitter.emit( 'end' );
    } );
  }

  function testExternals() {
    require( './parser' );
    require( './squint' );
    require( './builder/template' )
    require( './builder/function' );
    require( './builder/type' );
    require( './builder/forwarder' );
    require( './builder/declarer' );
    require( './builder/definer' );
    require( './builder/namespacer' );
  }
}

function oldTest() {

  // not sure about these
  function functionDefinitions() {
    assert.equal( squint.defineFunctions( 'text text(); text text();' ), 'text text(){} text text(){}' );
    assert.equal( squint.defineFunctions( 'text text(); text text; text text();' ), 'text text(){} text text(){}' );
    assert.equal( squint.defineFunctions( 'text text(); text text{}; text text();' ), 'text text(){} text text(){}' );
    assert.equal( squint.defineFunctions( 'text text(); text text(); text text();' ), 'text text(){} text text(){}' );
  }

  function subScopes() {
    var get = squint.getSubScopes
      , strip = squint.stripSubScopes
      , source = ' a {b} c {d} e'
      , subs = get( source )
      , rem = strip( source );
    
    assert.equal( subs[0], '{b}' );
    assert.equal( subs[1], '{d}' );
    assert.equal( rem, ' a  c  e' );

    subs = get('a { b { c } }');
    assert.equal( subs[0], '{ b { c } }' );
  }

  function declarations() {
    var getTypes = squint.getTypeDeclares
      , getFunctions = squint.getFunctionDeclares;
    
    assert.equal( getTypes( 'int text;' ), '' );
    assert.equal( getTypes( 'int text();' ), '' );
    
    assert.equal( getTypes( 'class text;' ), 'class text;' );
    assert.equal( getTypes( 'class text {' ), '' );
    
    assert.equal( getTypes( 'class text;' ), 'class text;' );
    
    // type declares need to be stripped for getFunctions 
    assert.equal( getFunctions( 'int text();' ), 'int text();' );
    assert.equal( getFunctions( 'int text() {;' ), '' );
  }

}