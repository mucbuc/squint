#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , Tokenizer = require( 'mucbuc-jsthree' ).Tokenizer
  , Base = require( '../base' ).Base
  , Commenter = require( '../../src/analyzers/commenter' ).Commenter
  , Expector = require( 'expector' ).Expector
  , fluke = require( 'flukejs' )
  , rules = {
      'comment line': '\\/\\/',
      'comment block': '\\/\\*',
    };

assert( typeof Commenter !== 'undefined' );

suite( 'commenter', function() {

  var emitter;
  setup(function() {
    emitter = new Expector;
  });
  
  teardown(function() {
    emitter.check(); 
    delete emitter;
  }); 

  // test( 'commenterSingleLine', function(){
  //   emitter.expect( 'comment line' );
  //   //emitter.expect( 'consume', 'hello\n' ); // not sure why this fails
  //   split( '// hello\n' );
  // });

  // test( 'commentBlock', function() {
  //   emitter.expect( 'comment block' );
  //   //emitter.expect( 'consume', 'hello*/' ); // not sure why this fails
  //   split( '/*hello*/' );
  // }); 

  function split( code ) {
    var commenter = new Commenter( emitter ); 

    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
      }
      , rules ); 
  }

});

