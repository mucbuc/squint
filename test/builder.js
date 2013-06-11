var assert = require( 'assert' )
  , events = require( 'events' )
  , Parser = require( 'parser' ).Parser
  , Builder = require( 'builder' ).Builder
  , Factory = require( 'factory' ).Factory;
  
basics();

function basics() {
  var builder = new TestContext();
}

function TestContext() {
  var emitter = new events.EventEmitter()
    , parser = new Parser( emitter )
    , builder = new Builder( emitter, new Factory() );
  
  parser.process( 'text { text; }' ); 
  
  process.on( 'exit', function() { 
    assert.equal( builder.document, '{;}' )
  } );
}

