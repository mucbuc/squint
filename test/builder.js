var assert = require( 'assert' )
  , events = require( 'events' )
  , Parser = require( '../src/parser' ).Parser
  , Analyzer = require( '../src/analyzer' ).Analyzer
  , Builder = require( '../src/builder' ).Builder
  , Forwarder = require( '../src/builder' ).Forwarder
  , Declarer = require( '../src/builder' ).Declarer
  , Factory = require( '../src/factory' ).Factory;

checkBuilder();

function checkBuilder() {

  test( forwarder );
  test( forwarder2 );
  test( declarer );

  function declarer(emitter, parser) {
    
    var builder = new Declarer( emitter );

    process.on( 'exit', function() {
      builder.buildProduct( new Factory(), function( result ) {
        assert.equal( result, 'struct dummy{void init();};' );
        console.log( 'declarer test passed' ); 
      } );
    } );

    parser.process( 'struct dummy{ void init(); };', emitter );
  } 

  function forwarder2(emitter, parser) {

    var builder = new Forwarder( emitter );

    process.on( 'exit', function() {
      builder.buildProduct( new Factory(), function(result) {
        assert.equal( result, 'struct dummy;' );
        console.log( 'forwarder2 test passed' );
      } );
    } );

    parser.process( 'struct dummy{ void init();', emitter );
  }

  function forwarder(emitter, parser) {

    var builder = new Forwarder( emitter );

    process.on( 'exit', function() {
      builder.buildProduct( new Factory(), function( result ) {
        assert.equal( result, 'struct dummy;' );
        console.log( 'forwarder test passed' );
      } ); 
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

  function test( f ) {
    var emitter = new events.EventEmitter()
      , parser = new Analyzer()
    
    f( emitter, parser );
  }
}