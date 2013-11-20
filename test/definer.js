var assert = require( 'assert' )
  , Builder = require( './base' ).Builder
  , Definer = require( '../src/definer' ).Definer
  , Factory = require( '../src/factory' ).Factory
  , test = Builder.test
  , expect = Builder.expect;


checkDefiner(); 

function checkDefiner() {

  test( defineMemberFunction );

  function defineMemberFunction(emitter, parser) { 
    
    var builder = new Definer( emitter );
    expect( builder, 'void dummy::init(){}' );
    parser.process( 'struct dummy{ void init(); };', emitter );
  }
}