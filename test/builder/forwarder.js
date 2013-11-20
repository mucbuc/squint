var assert = require( 'assert' )
  , Builder = require( '../base' ).Builder
  , Forwarder = require( '../../src/builder/forwarder' ).Forwarder
  , Factory = require( '../../src/factory' ).Factory
  , test = Builder.test
  , expect = Builder.expect;
  
checkForwarder();

function checkForwarder() {

  test( forwardEmptyType );
  test( forwarderTypeWithMemberFunction );

  function forwarderTypeWithMemberFunction(emitter, analyzer) {
    var builder = new Forwarder( emitter );
    expect( builder, 'struct dummy;', emitter ); 
    analyzer.process( 'struct dummy{ void init(); }', emitter );
  }

  function forwardEmptyType(emitter, analyzer) {
    var builder = new Forwarder( emitter );
    expect( builder, 'struct dummy;', emitter ); 
    analyzer.process( 'struct dummy{};', emitter );
  }
}