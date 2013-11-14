var assert = require( 'assert' )
  , Parser = require( 'squint/parser' ).Parser
  , Builder = require( 'squint/builder' ).Builder
  , Factory = require( 'squint/factory' ).Factory;
  
basics();

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