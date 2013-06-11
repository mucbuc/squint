var assert = require( 'assert' )
  , events = require( 'events' )
  , Parser = require( 'parser' ).Parser
  , Builder = require( 'builder' ).Builder;
  
basics();

function basics() {
  var builder = new TestBuilder();
}

function TestBuilder() {
  var emitter = new events.EventEmitter()
    , parser = new Parser( emitter )
    , builder = new Builder( emitter );
  
  emitter.on( 'open', function( code ) {
    builder.document = builder.document.concat( 'abc' + '{' );
  } );
  
  emitter.on( 'close', function( code ) {
    builder.document = builder.document.concat( '}' );
  } );
  
  parser.process( 'text { text; }' ); 
  
  process.on( 'exit', function() { 
    assert.equal( builder.document, 'abc{}' )
  } );
}

