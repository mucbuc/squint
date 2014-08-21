#!/usr/bin/env node

var assert = require( 'assert' )
  , Base = require( '../base' ).Base
  , Scoper = require( '../../src/analyzers/scoper' ).Scoper
  , Declarer = require( '../../src/analyzers/declarer' ).Declarer
  , defaultRules = {
        'open': '{',
        'close': '}'
      };

assert( typeof Declarer !== 'undefined' );

Base.test_2( declareType, defaultRules, Scoper );
Base.test_2( declareFunction, defaultRules, Scoper );
Base.test_2( declareNot, defaultRules, Scoper );
//  Base.test_2( ignoreSubScopes, defaultRules, Scoper );

function ignoreSubScopes(emitter, process) {
  var declarer = new Declarer( emitter ); 

  emitter.on( 'open', console.log ); 

  emitter.expectNot( 'declare type' );
  process( 'namespace { struct hello; }' );
}

function declareNot(emitter, process) {
  var declarer = new Declarer( emitter );
  emitter.expectNot( 'declare function' );
  process( 'bla bla;' );
  process( 'bla += bla();' );
}

function declareFunction( emitter, process ) {
  var declarer = new Declarer( emitter );
  emitter.expectNot( 'define function' );
  emitter.expect( 'declare function', 'void foo()' );
  process( 'void foo();' );
}

function declareType( emitter, process ) {
  var declarer = new Declarer( emitter );
  emitter.expectNot( 'define type' );
  emitter.expect( 'declare type', 'struct bla' );
  process( 'struct bla;' );
}

