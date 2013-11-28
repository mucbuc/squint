var assert = require( 'assert' )
  , Builder = require( '../base' ).Builder
  , Definer = require( '../../src/builder/definer' ).Definer
  , Factory = require( '../../src/factory' ).Factory
  , test = Builder.test
  , expect = Builder.expect;

checkDefiner(); 

function checkDefiner() {

  test( defineEmpty ); 
  test( defineMemberFunction );
  test( defineMemberFunctions );

  function defineMemberFunctions(emitter, parser) { 
    var builder = new Definer( emitter );
    emitter.expect( 'define type', 'struct dummy' );
    emitter.expect( 'type implementation', 'void init(); void init2();' );
    parser.process( 'struct dummy{ void init(); void init2();};', emitter );
  }

  function defineMemberFunction(emitter, parser) { 
    var builder = new Definer( emitter );
    emitter.expect( 'define type', 'struct dummy' );
    emitter.expect( 'type implementation', 'void init();' );
    parser.process( 'struct dummy{ void init(); };', emitter );
  }

  function defineEmpty(emitter, parser) {
    var builder = new Definer( emitter );
    emitter.expectNot( 'type implementation' );
    emitter.expect( 'define type', 'struct dummy' );
    parser.process( 'struct dummy{};', emitter );
  }
}