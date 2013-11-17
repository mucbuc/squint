var assert = require( 'assert' )
  , Parser = require( '../src/parser' ).Parser
  , Tester = require( './tester' )
  , testLog = Tester.testLog
  , makeEmitTester = Tester.makeEmitTester;

module.exports = { 
  run : function() {
    testDeliminator();
    testNested();
    testInterleaved();
    testScopes();
    testStatments();
  }, 
};

function testStatments() {
  var parser = new Parser()
    , emitter = makeEmitTester();

  emitter.expect( 'statement', '1' );
  emitter.expect( 'statement', '2' );
  emitter.expect( 'statement', '3' );
  emitter.expect( 'statement' );
 
  parser.process( '1; 2; 3;;', emitter );

  testLog( 'testStatments passed' );
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

  testLog( 'testScopes passed' );
}

function testInterleaved() { 
  var parser = new Parser()
    , emitter = makeEmitTester();
  
  emitter.expect( 'open', 'a' );
  emitter.expect( 'statement','b' );
  emitter.expect( 'close' );
   
  parser.process( 'a{ b; }', emitter );

  testLog( 'testInterleaved passed' );
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

  testLog( 'testNested passed' );
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

  testLog( 'testDeliminator passed' );
}
