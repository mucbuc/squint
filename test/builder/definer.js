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

  function defineMemberFunction(emitter, parser) { 
    var builder = new Definer( emitter );
    emitter.expect( 'type definition', 'struct dummy' );
    emitter.expect( 'type implementation', 'void init();' );
    parser.process( 'struct dummy{ void init(); };', emitter );
  }

  function defineEmpty(emitter, parser) {
    var builder = new Definer( emitter );
    emitter.once( 'type implementation', function() {
      assert( false );
    } ); 
    emitter.expect( 'type definition', 'struct dummy' );
    parser.process( 'struct dummy{};', emitter );
  }
}