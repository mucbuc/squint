var assert = require( 'assert' )
  , events = require( 'events' )
  , Parser = require( '../src/parser' ).Parser
  , Analyzer = require( '../src/analyzer' ).Analyzer
  , Builder = require( '../src/builder' ).Builder
  , Forwarder = require( '../src/builder' ).Forwarder
  , Factory = require( '../src/factory' ).Factory;

//basics();
forwarder();

function forwarder() {

  var emitter = new events.EventEmitter()
    , parser = new Analyzer()
    , result = '';

  emitter.on( 'type declaration', function( code ) {
    result = code + ';\n';
  } );

  process.on( 'exit', function() {
    assert.equal( result, 'struct dummy;\n' );
  
    console.log( 'forwarder test passed' );
  } );

  parser.process( 'struct dummy{', emitter );
}

function basics() {
  var builder = new TestContext();
}

function TestContext() {
  var parser = new Parser()
    , builder = new Builder( parser, new Factory() );
  
  parser.process( 'text { text; }' ); 
  
  process.on( 'exit', function() { 
    assert.equal( builder.document, '{;}' )
  } );
}