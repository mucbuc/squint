#!/usr/bin/env node

var assert = require( 'assert' )
  , Base = require( '../base' ).Base
  , Scoper = require( '../../src/analyzers/scoper' ).Scoper
  , Definer = require( '../../src/analyzers/definer' ).Definer
  , rules = {
      'open': '{',
      'close': '}',
    };

assert( typeof Definer !== 'undefined' );

Base.test_2( defineFunction, rules, Scoper ); 
Base.test_2( defineType, rules, Scoper ); 
Base.test_2( defineSubType, rules, Scoper ); 
Base.test_2( defineNamespace, rules, Scoper ); 

function defineFunction(emitter, process) {
  
  var definer = new Definer(emitter);

  emitter.expectNot( 'define namespace' );
  emitter.expectNot( 'define type' );

  emitter.expect( 'define function', { name: 'void foo() ', code: ' do something ' } );
  process( 'void foo() { do something }' );

  emitter.expect( 'define function', { name: 'void fool() ', code: ' do nothing ' } );
  process( 'void fool() { do nothing }' );

  emitter.expect( 'define function', {
    name: 'hello::hello()',
    code: 'bla bla',
    meta: ' base() '
  } );
  process( 'hello::hello() : base() {bla bla}' );
}

function defineSubType( emitter, process ) {
  
  var definer = new Definer(emitter);

  emitter.expect( 'define type', { name: 'struct cya ', code: ' yes ', meta: ' blu ' } );
  process( 'struct cya : blu { yes }' );
}

function defineType(emitter, process) {

  var definer = new Definer(emitter);

  emitter.expectNot( 'define namespace' );
  emitter.expectNot( 'define function' );

  emitter.expect( 'define type', { name: 'struct hello ', code: ' unsigned world; ' } );
  process( 'struct hello { unsigned world; }' );

  emitter.expect( 'define type', { name: 'struct cya ', code: ' yes' } );
  process( 'struct cya { yes}' );

  emitter.expect( 'define type', { name: ' struct cya ', code: ' yes' } );
  process( 'typedef hello string; struct cya { yes}' );
}

function defineNamespace(emitter, process) {

  var definer = new Definer(emitter);

  emitter.expectNot( 'define type' );
  emitter.expectNot( 'define function' );

  emitter.expect( 'define namespace', { name: 'namespace hello ', code: ' this is it ' } );
  process( 'namespace hello { this is it }' );

  emitter.expect( 'define namespace', { name: 'namespace world ', code: ' wtf? ' } );
  process( 'namespace world { wtf? }' );

  emitter.expect( 'define namespace', { name: 'namespace world', code: '' } );
  process( 'namespace world{}' );
}

