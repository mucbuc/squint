var assert = require( 'assert' )
  , Builder = require( '../base' ).Builder
  , Forwarder = require( '../../src/builder/forwarder' ).Forwarder
  , Factory = require( '../../src/factory' ).Factory
  , test = Builder.test
  , expect = Builder.expect;
  
checkForwarder();

function checkForwarder() {

  test( forwardType );
  test( forwardEmptyType );
  test( forwarderTypeWithMemberFunction );
  test( forwardMultipleTypes );
  test( forwardOnlyOnce );

  function forwardOnlyOnce(emitter, parser) {
    var builder = new Forwarder( emitter )
      , counter = 0;

    emitter.once( 'forward declare', function() {
      assert( counter == 0 );
      ++counter;
    } ); 

    parser.process( 'struct dummy{};', emitter ); 
  }

  function forwardMultipleTypes(emitter, parser) {
    var builder = new Forwarder( emitter );
    emitter.expect( 'forward declare', ['struct dummy', 'struct dummy2' ] );
    parser.process( 'struct dummy; struct dummy2{};', emitter );
  }

  function forwarderTypeWithMemberFunction(emitter, parser) {
    var builder = new Forwarder( emitter );
    emitter.expect( 'forward declare', ['struct dummy'] ); 
    parser.process( 'struct dummy{ void init(); };', emitter );
  }

  function forwardEmptyType(emitter, parser) {
    var builder = new Forwarder( emitter );
    emitter.expect( 'forward declare', ['struct dummy'] ); 
    parser.process( 'struct dummy{};', emitter );
  }

  function forwardType(emitter, parser) {
    var builder = new Forwarder( emitter );
    emitter.expect( 'forward declare', ['struct dummy'] ); 
    parser.process( 'struct dummy;', emitter );
  }
}