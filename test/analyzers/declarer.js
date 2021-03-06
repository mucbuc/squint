#!/usr/bin/env node

var assert = require( 'assert' )
  , Base = require( '../base' ).Base
  , Scoper = require( '../../src/analyzers/scoper' ).Scoper
  , Declarer = require( '../../src/analyzers/declarer' ).Declarer
  , rules = {
        'statement': ';',
        'open': '{'
      }
  , Expector = require( 'expector' ).Expector
  , fluke = require( 'flukejs' ); 

assert( typeof Declarer !== 'undefined' );

suite( 'declarer', function() {

  var emitter;
  setup(function() {
    emitter = new Expector;
  });

  teardown(function() {
    emitter.check(); 
    delete emitter;
  }); 

  test( 'declareType', function(){
    emitter.expectNot( 'define type' );
    emitter.expect( 'declare type', 'struct bla' );
    split( 'struct bla;' );
  });

  test( 'declareFunction', function(){
    emitter.expectNot( 'define function' );
    emitter.expect( 'declare function', 'void foo()' );
    split( 'void foo();' );
  });

  test( 'declareNot', function(){
    emitter.expectNot( 'declare function' );
    split( 'bla bla;' );
    split( 'bla += bla();' );
  });

  test( 'ignoreSubScopes', function(){
    emitter.expectNot( 'declare type' );
    split( 'namespace { struct hello; }' );
  });

  function split( code ) {
    var tokenizer = new Scoper( emitter, rules )
      , definer = new Declarer(emitter);
    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
      }
      , rules ); 
  }
});
