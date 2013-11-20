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

  test( forwarderEmpty );
  test( forwarderNonStaticMemberFunction );
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

  function forwarderNonStaticMemberFunction(emitter, parser) {

    var builder = new Forwarder( emitter );

    process.on( 'exit', function() {
      builder.buildProduct( new Factory(), function(result) {
        assert.equal( result, 'struct dummy;' );
        console.log( 'forwarderNonStaticMemberFunction test passed' );
      } );
    } );

    parser.process( 'struct dummy{ void init(); }', emitter );
  }

  function forwarderEmpty(emitter, parser) {

    var builder = new Forwarder( emitter );

    process.on( 'exit', function() {
      builder.buildProduct( new Factory(), function( result ) {
        assert.equal( result, 'struct dummy;' );
        console.log( 'forwarderEmpty test passed' );
      } ); 
    } );

    parser.process( 'struct dummy{};', emitter );
  }

  function test( f ) {
    var emitter = new events.EventEmitter()
      , parser = new Analyzer()
    
    f( emitter, parser );
  }
}