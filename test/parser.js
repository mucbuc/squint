var assert = require( 'assert' )
  , Parser = require( '../src/parser' ).Parser
  , makeEmitTester = require( './tester' ).makeEmitTester;

module.exports = { 
  run : function() {
    testDeliminator();
    testNested();
    testInterleaved();
    testScopes();
    testStatments();
  }, 
};

module.exports.run();

function testStatments() {
  var parser = new Parser()
    , emitter = makeEmitTester();

  emitter.expect( 'statement', '1' );
  emitter.expect( 'statement', '2' );
  emitter.expect( 'statement', '3' );
  emitter.expect( 'statement' );
 
  parser.process( '1; 2; 3;;', emitter );

  process.on( 'exit', function() {
    console.log( 'testStatments passed' );
  } );
}

function testScopes() {
  var parser = new Parser()
    , emitter = makeEmitTester();
  
  emitter.expect( 'open', 'a' ); 
  emitter.expect( 'close' );
  emitter.expect( 'open', 'b' );
  emitter.expect( 'close' );
  emitter.expect( 'open', 'c' );
  emitter.expect( 'close' );
 
  parser.process( 'a{} b{} c{}', emitter );

  process.on( 'exit', function() {
    console.log( 'testScopes passed' );
  } );
}

function testInterleaved() { 
  var parser = new Parser()
    , emitter = makeEmitTester();
  
  emitter.expect( 'open', 'a' );
  emitter.expect( 'statement','b' );
  emitter.expect( 'close' );
   
  parser.process( 'a{ b; }', emitter );

  process.on( 'exit', function() {
    console.log( 'testInterleaved passed' );
  } );
}

function testNested() {
  var parser = new Parser()
    , emitter = makeEmitTester();

  emitter.expect( 'open', 'a' );
  emitter.expect( 'open', 'b' );
  emitter.expect( 'statement', 'c' );
  emitter.expect( 'close' );
  emitter.expect( 'close' );

  parser.process( 'a { b { c; } }', emitter );

  process.on( 'exit', function() {
    console.log( 'testNested passed' );
  } );
}

function testDeliminator() {
  var parser = new Parser()
    , emitter = makeEmitTester();
  
  emitter.expect( 'statement', 'a' ); 
  parser.process( 'a;', emitter );
  
  emitter.expect( 'statement', 'a' ); 
  parser.process( 'a ;', emitter );

  emitter.expect( 'statement', 'a' ); 
  parser.process( ' a;', emitter );

  emitter.expect( 'statement', 'a' ); 
  parser.process( ' a ;', emitter );

  emitter.expect( 'open', 'a' ); 
  parser.process( 'a {', emitter );

  emitter.expect( 'open', 'a' ); 
  parser.process( 'a{', emitter );

  emitter.expect( 'open', 'a' ); 
  parser.process( ' a {', emitter );

  emitter.expect( 'open', 'a' ); 
  parser.process( ' a{', emitter );

  process.on( 'exit', function() {
    console.log( 'testDeliminator passed' );
  } );
}
