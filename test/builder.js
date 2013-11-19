var assert = require( 'assert' )
  , events = require( 'events' )
  , Parser = require( '../src/parser' ).Parser
  , Analyzer = require( '../src/analyzer' ).Analyzer
  , Builder = require( '../src/builder' ).Builder
  , Forwarder = require( '../src/builder' ).Forwarder
  , Declarer = require( '../src/builder' ).Declarer
  , Factory = require( '../src/factory' ).Factory;


//basics();
forwarder();
forwarder2();
declarer();

function declarer() {
  
  var emitter = new events.EventEmitter()
    , parser = new Analyzer()
    , factory = {
        createType: function(code) {
            return code + '{};\n'; 
          }
        }
    , builder = new Declarer( emitter, factory );

  process.on( 'exit', function() {
    assert.equal( builder.result, 'struct dummy{void init();};' );
    console.log( 'declarer test passed' );
  } );

  parser.process( 'struct dummy{ void init(); };', emitter );
} 

function forwarder2() {

  var emitter = new events.EventEmitter()
    , parser = new Analyzer()
    , result = ''
    , factory = {
        createType: function(code) {
          return code + ';\n';
        }
      }
    , builder = new Forwarder( emitter, factory );

  process.on( 'exit', function() {
    assert.equal( builder.result, 'struct dummy;\n' );
    console.log( 'forwarder2 test passed' );
  } );

  parser.process( 'struct dummy{ void init();', emitter );
}

function forwarder() {

  var emitter = new events.EventEmitter()
    , parser = new Analyzer()
    , result = ''
    , factory = {
        createType: function(code) {
          return code + ';\n';
        }
      }
    , builder = new Forwarder( emitter, factory );

  process.on( 'exit', function() {
    assert.equal( builder.result, 'struct dummy;\n' );
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