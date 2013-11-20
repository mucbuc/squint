var assert = require( 'assert' )
  , Builder = require( './base' ).Builder
  , Declarer = require( '../src/declarer' ).Declarer
  , Factory = require( '../src/factory' ).Factory
  , test = Builder.test
  , expect = Builder.expect;
  
testDeclarer();

function testDeclarer() {

  test( declareEmptyType );
  test( declareMemberFunction );

  function declareMemberFunction(emitter, parser) {
    
    var builder = new Declarer( emitter );
    expect( builder, 'struct dummy{void init();};' );
    parser.process( 'struct dummy{ void init(); };', emitter );
  } 

  function declareEmptyType(emitter, parser) {

    var builder = new Declarer( emitter );
    expect( builder,'struct dummy{};' );
    parser.process( 'struct dummy{};', emitter );
  }

}