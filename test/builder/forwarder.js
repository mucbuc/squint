var assert = require( 'assert' )
  , Builder = require( '../base' ).Builder
  , Forwarder = require( '../../src/builder/forwarder' ).Forwarder
  , Factory = require( '../../src/factory' ).Factory
  , test = Builder.test
  , expect = Builder.expect;
  
checkForwarder();

function checkForwarder() {

 // test( forwardType );
  test( forwardEmptyType );

  //test( forwarderTypeWithMemberFunction );

  function forwarderTypeWithMemberFunction(emitter, parser) {
    var builder = new Forwarder( emitter );
    emitter.expect( 'forward declare', 'struct dummy;' ); 
    parser.process( 'struct dummy{ void init(); }', emitter );
  }

  function forwardEmptyType(emitter, parser) {
    
    var builder = new Forwarder( emitter );
    emitter.expect( 'forward declare', 'struct dummy;' ); 
    parser.process( 'struct dummy{};', emitter );
  }

  function forwardType(emitter, parser) {
    
    var builder = new Forwarder( emitter );
    emitter.expect( 'forward declare', 'struct dummy' ); 
    parser.process( 'struct dummy;', emitter );
  }
}