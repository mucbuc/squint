#!/usr/bin/env node

var assert = require( 'assert' )
  , squint = require( '../src/squint' )
  , parser = require( './parser' )
  , squint = require( './squint' )
  , squint = require( './builder/function' )
  , squint = require( './builder/template' )
  , squint = require( './builder/type' );

/*
  , analyzer = require( './analyzer' )
  , forwarder = require( './builder/forwarder' )
  , declarer = require( './builder/declarer' )
  , definer = require( './builder/definer' );

*/ 

assert( typeof squint != 'undefined' );

process.setMaxListeners( 0 );

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

